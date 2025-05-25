import { createClient,type RedisClientType } from "redis";

type RedisConfig = {
    host:string;
    port:number;
    password?:string;
    maxRetries?:number;
    retryDelays:number;
};

export class RedisClient{
    private client:RedisClientType;
    private config:RedisConfig;

    constructor(config:Partial<RedisConfig>={}){
        this.config={
            host:'localhost',
            port:6379,
            maxRetries:5,
            retryDelays:5000,
            ...config
        };
        this.client = createClient({
            socket:{
                host:this.config.host,
                port:this.config.port,
                reconnectStrategy:(retries)=>{
                    if(retries>=5){
                        return new Error('Max retries reached');
                    }
                    return this.config.retryDelays ?? 5000;
                }
            },
            password:this.config.password
        });
        this.setupEventListener();
    }
    private setupEventListener():void{
        this.client.on('connect', () => {
            console.log('Redis connecting...');
        });

        this.client.on('ready', () => {
            console.log('Redis connected and ready');
        });

        this.client.on('error', (err) => {
            console.error('Redis error:', err);
        });

        this.client.on('end', () => {
            console.log('Redis disconnected');
        });

        this.client.on('reconnecting', () => {
            console.log('Redis reconnecting...');
        });
            
    }
    public async connect():Promise<void>{
        try {
            await this.client.connect();
        } catch (error) {
            console.error('redis connected failed',error);
            throw error;
        }
    }
    public async disconnect():Promise<void>{
        try {
            await this.client.quit();
        } catch (error) {
            console.error('redis disconnected failed',error);
            throw error;
        }
    }
    public async set(key:string,value:string,options?:{ttl?:number}):Promise<void>{
        if(options?.ttl){
            await this.client.setEx(key,options.ttl,value);
        }else{
            this.client.set(key,value);
        }
    }
    public async get(key:string):Promise<string|null>{
        return await this.client.get(key);
    }
    public async delete(key:string):Promise<boolean>{
        const result = await this.client.del(key);
        return result > 0;
    }
    public async exists(key:string):Promise<boolean>{
        const result = await this.client.exists(key);
        return result === 1;
    }
};
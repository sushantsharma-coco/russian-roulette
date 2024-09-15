import { createClient } from "redis";

export class RedisClient {
  connection: any;
  constructor() {
    this.initRedis();
  }

  async initRedis() {
    this.connection = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    await this.connection.connect();
  }

  async getFromRedis(key: string): Promise<any> {
    if (!this.connection) this.initRedis();

    if (this.connection) {
      let result = (await this.connection.get(key)) ?? null;
      return JSON.parse(result);
    }
  }
  async setToRedis(key: string, data: any, ttl: number = 3600): Promise<any> {
    if (!this.connection) this.initRedis();

    if (this.connection) {
      let result = await this.connection.set(key, JSON.stringify(data), {
        EX: ttl,
      });
      return result;
    }
  }
  async removeFromRedis(key: string) {
    if (!this.connection) this.initRedis();

    if (this.connection) {
      let result = await this.connection.del(key);
      return result;
    }
  }
}

export const redisClient = new RedisClient();

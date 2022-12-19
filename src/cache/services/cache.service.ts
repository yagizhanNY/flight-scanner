import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private redisService: Redis) {}

  public async Add(key: string, value: any): Promise<string> {
    return await this.redisService.set(key, JSON.stringify(value));
  }

  public async Get(key: string): Promise<string> {
    return await this.redisService.get(key);
  }
}

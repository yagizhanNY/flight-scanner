import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import Redis, { RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
  client: Redis;

  constructor(private configService: ConfigService) {
    const host: string = this.configService.get('REDIS_URL') as string;
    const port: number = this.configService.get('REDIS_PORT') as number;

    this.client = new Redis({
      port: port,
      host: host,
    });
  }

  public async Add(key: string, value: any): Promise<string> {
    return await this.client.set(key, JSON.stringify(value));
  }

  public async Get(key: string | Buffer): Promise<string> {
    return await this.client.get(key);
  }
}

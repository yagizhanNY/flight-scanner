import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { RedisService } from './services/redis.service';

@Module({
  providers: [RedisService],
  imports: [ConfigModule],
  exports: [RedisService]
})
export class RedisModule {}

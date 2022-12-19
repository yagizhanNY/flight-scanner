import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { CacheService } from './services/cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  providers: [CacheService],
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_URL,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
  exports: [CacheService],
})
export class CacheModule {}

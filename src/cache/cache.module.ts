import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { CacheService } from './services/cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  providers: [CacheService],
  imports: [
    ConfigModule,
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  exports: [CacheService],
})
export class CacheModule {}

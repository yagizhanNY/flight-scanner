import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { FlightController } from './controller/flight.controller';
import { RedisModule } from 'src/redis/redis.module';
import { FlightService } from './services/flight.service';
import { FlightTaskService } from './services/flight-task/flight-task.service';
import { FlightSourceService } from './services/flight-source/flight-source.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, RedisModule, ConfigModule],
  controllers: [FlightController],
  providers: [
    FlightService,
    FlightTaskService,
    FlightSourceService,
    FlightSourceService,
    Logger,
  ],
})
export class FlightModule {}

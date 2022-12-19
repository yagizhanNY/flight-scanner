import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { FlightController } from './controller/flight.controller';
import { FlightService } from './services/flight.service';
import { FlightTaskService } from './services/flight-task/flight-task.service';
import { FlightSourceService } from './services/flight-source/flight-source.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [HttpModule, CacheModule, ConfigModule],
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

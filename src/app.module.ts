import { Module } from '@nestjs/common';
import { FlightModule } from './flight/flight.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    FlightModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_URL: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        FLIGHT_SOURCES_FILE_NAME: Joi.string().required(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

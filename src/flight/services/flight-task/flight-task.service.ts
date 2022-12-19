import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { Flight } from '../../../models/interfaces/flight.interface';
import { Slice } from '../../../models/interfaces/slice.interface';
import { BaseFlight } from '../../../models/interfaces/base-flight.interface';
import { CACHE_FLIGHT_KEY } from '../../../consts/cache.consts';
import { CacheService } from '../../../cache/services/cache.service';
import { FlightSourceService } from '../flight-source/flight-source.service';
import { FlightSources } from '../../../models/interfaces/flight-sources.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlightTaskService {
  constructor(
    private httpService: HttpService,
    private cacheService: CacheService,
    private flightSourceService: FlightSourceService,
    private configService: ConfigService,
    private logger: Logger,
  ) {}

  isError: boolean = false;

  @Cron(CronExpression.EVERY_MINUTE)
  async CheckRequestError() {
    if (this.isError === true) {
      try {
        await this.TraceFlights();

        this.isError = false;
      } catch {
        this.logger.error('Still in error');
      }
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async TraceFlights(key: string = 'FLIGHT_SOURCES_FILE_NAME'): Promise<void> {
    const resourcesFolderPath: string = './dist/resources/';
    const fileName = await this.configService.get(key);
    let flightSources: FlightSources;

    if (fileName) {
      try {
        flightSources = await this.flightSourceService.GetFlightSourcesFromFile(
          resourcesFolderPath + fileName,
        );
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error('File name not found');
    }

    for await (var source of flightSources.sources) {
      try {
        var data = await this.GetDataFromSource(source);
        this.isError = false;
      } catch {
        this.logger.error('Bad request!');
        this.isError = true;

        break;
      }

      var flights = await this.RemoveDuplicatedFlights(data);
      this.logger.log('Received successfully..', flights.length);
    }

    if (this.isError == false) {
      await this.SaveBaseFlightToCache(flights);
    }
  }

  async SaveBaseFlightToCache(flights: Flight[]): Promise<string> {
    var baseFlightObject: BaseFlight = {
      flights: flights,
    };

    return await this.cacheService.Add(
      CACHE_FLIGHT_KEY,
      JSON.stringify(baseFlightObject),
    );
  }

  async RemoveDuplicatedFlights(
    baseFlightObject: BaseFlight,
  ): Promise<Flight[]> {
    let flights: Flight[] = [];
    let sliceMap = new Map();

    var tempFlights: Flight[] = baseFlightObject.flights;

    tempFlights.forEach((flight) => {
      let newSlices: Slice[] = [];
      for (var slice of flight.slices) {
        let filterString: string =
          slice.flight_number +
          slice.arrival_date_time_utc.toString() +
          slice.departure_date_time_utc.toString();
        const isExists: boolean = sliceMap.has(filterString);

        if (isExists == false) {
          sliceMap.set(filterString, 1);
          newSlices.push(slice);
        }
      }

      flight.slices = newSlices;

      if (flight.slices.length > 0) flights.push(flight);
    });

    return flights;
  }

  async GetDataFromSource(source: string): Promise<BaseFlight> {
    try {
      var data = await firstValueFrom(this.httpService.get<BaseFlight>(source));
      if (data.status === HttpStatus.OK) {
        return data.data;
      }
      throw new BadRequestException();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}

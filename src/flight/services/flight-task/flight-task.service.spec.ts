import { Test, TestingModule } from '@nestjs/testing';
import { FlightTaskService } from './flight-task.service';
import { HttpService } from '@nestjs/axios';
import { CacheService } from '../../../cache/services/cache.service';
import { ConfigService } from '@nestjs/config';
import { FlightSourceService } from '../flight-source/flight-source.service';
import { FlightSources } from '../../../models/interfaces/flight-sources.interface';
import { Flight } from '../../../models/interfaces/flight.interface';
import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { BaseFlight } from 'src/models/interfaces/base-flight.interface';
import { of, throwError } from 'rxjs';

describe('FlightCronServiceService', () => {
  let service: FlightTaskService;
  let flightSourceService: FlightSourceService;
  let httpService: HttpService;
  let logger: Logger;

  const mockFlights: Flight[] = [
    {
      slices: [
        {
          origin_name: 'Schonefeld',
          destination_name: 'Stansted',
          departure_date_time_utc: new Date('2019-08-08T16:00:00.000Z'),
          arrival_date_time_utc: new Date('2019-08-08T17:55:00.000Z'),
          flight_number: '146',
          duration: 115,
        },
        {
          origin_name: 'Stansted',
          destination_name: 'Schonefeld',
          departure_date_time_utc: new Date('2019-08-10T18:00:00.000Z'),
          arrival_date_time_utc: new Date('2019-08-10T20:00:00.000Z'),
          flight_number: '8544',
          duration: 120,
        },
      ],
      price: 130.1,
    },
  ];

  const mockDuplicatedBaseFlight: BaseFlight = {
    flights: [
      {
        slices: [
          {
            origin_name: 'Schonefeld',
            destination_name: 'Stansted',
            departure_date_time_utc: new Date('2019-08-08T16:00:00.000Z'),
            arrival_date_time_utc: new Date('2019-08-08T17:55:00.000Z'),
            flight_number: '146',
            duration: 115,
          },
          {
            origin_name: 'Stansted',
            destination_name: 'Schonefeld',
            departure_date_time_utc: new Date('2019-08-10T18:00:00.000Z'),
            arrival_date_time_utc: new Date('2019-08-10T20:00:00.000Z'),
            flight_number: '8544',
            duration: 120,
          },
          {
            origin_name: 'Stansted2',
            destination_name: 'Schonefeld2',
            departure_date_time_utc: new Date('2019-08-10T18:00:00.000Z'),
            arrival_date_time_utc: new Date('2019-08-10T20:00:00.000Z'),
            flight_number: '8544',
            duration: 121,
          },
        ],
        price: 130.1,
      },
    ],
  };

  let mockHttpService = {
    get: jest.fn((source: string) => {
      const mockResponseOk = {
        status: HttpStatus.OK,
        data: mockDuplicatedBaseFlight,
      };

      const mockResponseNotOk = {
        status: HttpStatus.BAD_REQUEST,
        data: {},
      };

      if (source === 'OK') return of(mockResponseOk);
      else if (source === 'NOT OK') return of(mockResponseNotOk);
      else if (source === 'BAD') return throwError(() => new Error('BAD'));
    }),
  };

  let mockCacheService = {
    Add: jest.fn(async () => {
      return 'OK';
    }),
  };

  let mockConfigService = {
    get: jest.fn(async (key: string): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        if (key === 'FLIGHT_SOURCES_FILE_NAME') {
          resolve('flight-sources.json');
        } else {
          resolve(undefined);
        }
      });
    }),
  };

  let mockFlightSourceService = {
    GetFlightSourcesFromFile: jest.fn(
      (filePath: string): Promise<FlightSources> => {
        return new Promise<FlightSources>((resolve, reject) => {
          if (filePath === './dist/resources/flight-sources.json') {
            const flightSources: FlightSources = {
              sources: ['source1', 'source2'],
            };
            resolve(flightSources);
          } else {
            reject("Can't read file.");
          }
        });
      },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightTaskService,
        HttpService,
        CacheService,
        ConfigService,
        FlightSourceService,
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .overrideProvider(CacheService)
      .useValue(mockCacheService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(FlightSourceService)
      .useValue(mockFlightSourceService)
      .compile();

    logger = module.get<Logger>(Logger);
    service = module.get<FlightTaskService>(FlightTaskService);
    flightSourceService = module.get<FlightSourceService>(FlightSourceService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CheckRequestError', () => {
    it('TraceFlights method should call once if error is exist', async () => {
      service.isError = true;
      const spy = jest.spyOn(service, 'TraceFlights').mockResolvedValue();
      await service.CheckRequestError();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('TraceFlights method should not call if error is not exist', async () => {
      service.isError = false;
      const spy = jest.spyOn(service, 'TraceFlights').mockResolvedValue();
      await service.CheckRequestError();
      expect(spy).not.toBeCalled();
    });

    it('should log error when error still exist when TraceFlight method runs once', async () => {
      service.isError = true;

      jest.spyOn(service, 'TraceFlights').mockRejectedValue('error');
      await service.CheckRequestError();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('TraceFlight', () => {
    it('should throw an error if file name undefined', async () => {
      await expect(service.TraceFlights('test')).rejects.toEqual(
        new Error('File name not found'),
      );
    });

    it('should throw an error if file path is wrong', async () => {
      jest
        .spyOn(flightSourceService, 'GetFlightSourcesFromFile')
        .mockRejectedValue('error');

      expect(service.TraceFlights()).rejects.toEqual('error');
    });

    it('should throw an error when bad request', async () => {
      const mockFlightSources: FlightSources = {
        sources: ['source1', 'source2'],
      };
      jest
        .spyOn(flightSourceService, 'GetFlightSourcesFromFile')
        .mockResolvedValue(mockFlightSources);

      jest.spyOn(service, 'GetDataFromSource').mockRejectedValue('error');

      await service.TraceFlights();

      expect(logger.error).toBeCalledTimes(1);
    });

    it('should save flights to the cache successfully', async () => {
      const mockFlightSources: FlightSources = {
        sources: ['source1', 'source2'],
      };

      const mockBaseFlight: BaseFlight = {
        flights: [
          {
            slices: [
              {
                origin_name: 'Schonefeld',
                destination_name: 'Stansted',
                departure_date_time_utc: new Date(),
                arrival_date_time_utc: new Date(),
                flight_number: '146',
                duration: 115,
              },
            ],
            price: 130.1,
          },
        ],
      };
      jest
        .spyOn(flightSourceService, 'GetFlightSourcesFromFile')
        .mockResolvedValue(mockFlightSources);

      jest
        .spyOn(service, 'GetDataFromSource')
        .mockResolvedValue(mockBaseFlight);

      const saveCacheSpy = jest.spyOn(service, 'SaveBaseFlightToCache');

      await service.TraceFlights();

      expect(saveCacheSpy).toBeCalledTimes(1);
    });
  });

  describe('SaveBaseFlightToCache', () => {
    it('should save flight to the cache successfully', async () => {
      jest.spyOn(service, 'SaveBaseFlightToCache').mockResolvedValue('OK');

      expect(await service.SaveBaseFlightToCache(mockFlights)).toEqual('OK');
    });
  });

  describe('RemoveDuplicatedFlights', () => {
    it('should remove duplicated slice', async () => {
      expect(
        await service.RemoveDuplicatedFlights(mockDuplicatedBaseFlight),
      ).toEqual(mockFlights);
    });
  });

  describe('GetDataFromSource', () => {
    it('should throw an error if http status is no ok', async () => {
      await expect(service.GetDataFromSource('NOT OK')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error when httpService throws an error', async () => {
      await expect(service.GetDataFromSource('BAD')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return BaseFlight data', async () => {
      expect(await service.GetDataFromSource('OK')).toEqual(
        mockDuplicatedBaseFlight,
      );
    });
  });
});

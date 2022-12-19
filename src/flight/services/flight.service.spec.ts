import { Test, TestingModule } from '@nestjs/testing';
import { FlightService } from './flight.service';
import { RedisService } from '../../redis/services/redis.service';
import { BaseFlight } from '../../models/interfaces/base-flight.interface';
import { BadRequestException } from '@nestjs/common';

describe('FlightService', () => {
  let service: FlightService;

  const mockBaseFlightObject: BaseFlight = {
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

  let mockRedisService = {
    Get: jest.fn((key: string): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        if (key === 'flights') {
          const result: string = JSON.stringify(mockBaseFlightObject);
          resolve(result);
        } else {
          resolve(undefined);
        }
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightService, RedisService],
    })
      .overrideProvider(RedisService)
      .useValue(mockRedisService)
      .compile();

    service = module.get<FlightService>(FlightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return BaseFlightObject if key is flights', async () => {
    expect(await service.GetFlights('flights')).toEqual({
      flights: [
        {
          slices: [
            {
              origin_name: expect.any(String),
              destination_name: expect.any(String),
              departure_date_time_utc: expect.any(String),
              arrival_date_time_utc: expect.any(String),
              flight_number: expect.any(String),
              duration: expect.any(Number),
            },
          ],
          price: expect.any(Number),
        },
      ],
    });
  });

  it('should throw BadRequestException when key is not "flights"', async () => {
    expect(service.GetFlights('test')).rejects.toThrow(BadRequestException);
  });
});

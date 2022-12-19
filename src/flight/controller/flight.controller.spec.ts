import { Test, TestingModule } from '@nestjs/testing';
import { FlightController } from './flight.controller';
import { FlightService } from '../services/flight.service';
import { BaseFlight } from '../../models/interfaces/base-flight.interface';

describe('FlightController', () => {
  let controller: FlightController;

  const mockBaseFlightObject: BaseFlight = {
    flights: [
      {
        slices: [
          {
            origin_name: "Schonefeld",
            destination_name: "Stansted",
            departure_date_time_utc: new Date(),
            arrival_date_time_utc: new Date(),
            flight_number: "146",
            duration: 115
          }
        ],
        price: 130.1
      }
    ]
  }

  let mockFlightService = {
    GetFlights: jest.fn(() => {
      return mockBaseFlightObject;
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightController],
      providers: [FlightService]
    })
    .overrideProvider(FlightService)
    .useValue(mockFlightService)
    .compile();

    controller = module.get<FlightController>(FlightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return flights', async () => {
    expect(await controller.GetFlights()).toEqual({
      flights: [
        {
          slices: [
            {
              origin_name: expect.any(String),
              destination_name: expect.any(String),
              departure_date_time_utc: expect.any(Date),
              arrival_date_time_utc: expect.any(Date),
              flight_number: expect.any(String),
              duration: expect.any(Number)
            }
          ],
          price: expect.any(Number)
        }
      ]
    })
  })
});

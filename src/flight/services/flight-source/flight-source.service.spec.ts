import { Test, TestingModule } from '@nestjs/testing';
import { FlightSourceService } from './flight-source.service';
import * as fs from 'fs/promises';
import { FlightSources } from 'src/models/interfaces/flight-sources.interface';

describe('FlightSourceService', () => {
  let service: FlightSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightSourceService],
    }).compile();

    service = module.get<FlightSourceService>(FlightSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetFlightSourcesFromFile', () => {
    it('should throw an error when file content is undefined', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue(undefined);
      expect(service.GetFlightSourcesFromFile('test')).rejects.toThrowError();
    });

    it('should throw an error when return string not json', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue('test context');
      expect(service.GetFlightSourcesFromFile('test')).rejects.toThrowError();
    });

    it('should throw and error when flight source array is empty', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue('{sources: []}');
      expect(service.GetFlightSourcesFromFile('test')).rejects.toThrowError();
    });

    it('should return flight sources', async () => {
      const mockSource: FlightSources = {
        sources: ['source1', 'source2'],
      };
      jest
        .spyOn(fs, 'readFile')
        .mockResolvedValue('{"sources": ["source1", "source2"]}');
      expect(await service.GetFlightSourcesFromFile('test')).toEqual(
        mockSource,
      );
    });
  });
});

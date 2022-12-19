import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

describe('RedisService', () => {
  let service: RedisService;

  let mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'REDIS_URL') return 'localhost';
      else if (key === 'REDIS_PORT') return 6379;
    }),

    set: jest.fn(async (key: string, value: string): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        resolve('OK');
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Add', () => {
    it('should add value to the cache', async () => {
      expect(await service.Add('key', 'value')).toEqual('OK');
    });
  });

  describe('Get', () => {
    it('should get value from cache', async () => {
      expect(await service.Get('key')).toEqual(expect.any(String));
    });
  });
});

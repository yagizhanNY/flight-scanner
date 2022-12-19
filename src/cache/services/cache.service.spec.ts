import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { getRedisToken } from '@liaoliaots/nestjs-redis/dist/redis/common';

describe('CacheService', () => {
  let service: CacheService;
  let get: jest.Mock;
  let set: jest.Mock;

  beforeEach(async () => {
    get = jest.fn();
    set = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: getRedisToken('default'),
          useValue: {
            get,
            set,
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Add', () => {
    it('should add value to the cache', async () => {
      set.mockResolvedValue('OK');
      var response: string = await service.Add('key', 'value');
      expect(response).toEqual(expect.any(String));
    });
  });

  describe('Get', () => {
    it('should get value from cache', async () => {
      get.mockResolvedValue('string');
      var response: string = await service.Get('key');
      expect(response).toEqual(expect.any(String));
    });
  });
});

import { BadRequestException, Injectable } from '@nestjs/common';
import { CACHE_FLIGHT_KEY } from '../../consts/cache.consts';
import { BaseFlight } from '../../models/interfaces/base-flight.interface';
import { CacheService } from '../../cache/services/cache.service';

@Injectable()
export class FlightService {
  constructor(private redisService: CacheService) {}

  async GetFlights(key: string): Promise<BaseFlight> {
    var cacheString: string = await this.redisService.Get(key);
    if (cacheString) {
      return (await JSON.parse(cacheString)) as BaseFlight;
    }

    throw new BadRequestException("Can't access to flights.");
  }
}

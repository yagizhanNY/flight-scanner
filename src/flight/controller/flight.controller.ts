import { Controller, Get, Header } from '@nestjs/common';
import { BaseFlight } from '../../models/interfaces/base-flight.interface';
import { FlightService } from '../services/flight.service';
import { CACHE_FLIGHT_KEY } from '../../consts/cache.consts';

@Controller('flights')
export class FlightController {

    constructor(private flightService: FlightService){}
    
    @Get()
    @Header('content-type', 'application/json')
    async GetFlights(): Promise<BaseFlight>
    {
        return await this.flightService.GetFlights(CACHE_FLIGHT_KEY);
    }
}

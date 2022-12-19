import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { FlightSources } from '../../../models/interfaces/flight-sources.interface';

@Injectable()
export class FlightSourceService {
  constructor() {}

  async GetFlightSourcesFromFile(filePath: string): Promise<FlightSources> {
    try {
      var fileContent = await readFile(filePath);
      if (!fileContent) throw new Error('Can not read the file.');

      const flightSources: FlightSources = await JSON.parse(
        fileContent.toString(),
      );

      if (flightSources.sources.length > 0) {
        return flightSources;
      } else {
        throw new Error('Flight sources are empty.');
      }
    } catch (err) {
      throw new Error('Can not read the file.');
    }
  }
}

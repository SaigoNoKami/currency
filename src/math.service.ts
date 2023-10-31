import { Injectable } from '@nestjs/common';
import { fixed } from './interfaces/fixed.interface';

@Injectable()
export class MathService {
  async getStatistic(days: fixed[], currency: string, average: number) {
    const result = {
      daysAboveAverage: [],
      daysBelowAverage: [],
      average: average,
    };
    for (const element of days) {
      if (element.rates[currency] > average) {
        result.daysAboveAverage.push({
          date: element.date,
          rate: element.rates[currency],
        });
      } else {
        result.daysBelowAverage.push({
          date: element.date,
          rate: element.rates[currency],
        });
      }
    }
    return result;
  }
}

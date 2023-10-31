import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { fixed } from './interfaces/fixed.interface';
import { ConfigEnv } from './config';
@Injectable()
export class FixedService {
  async getExchangeRate(year: number): Promise<fixed[]> {
    try {
      const apiUrl = 'http://data.fixer.io/api';
      const access_key = ConfigEnv.FIXED_API_KEY;

      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const requests: Promise<fixed | undefined>[] = [];
      while (startDate <= endDate) {
        let month: number | string = startDate.getMonth() + 1;
        let day: number | string = startDate.getDate();
        if (month < 10) {
          month = '0' + month;
        }
        if (day < 10) {
          day = '0' + day;
        }
        const url = `${apiUrl}/${year}-${month}-${day}?access_key=${access_key}`;
        const request = axios
          .get(url)
          .then((response) => {
            if (response?.data?.rates) {
              return { date: response.data.date, rates: response.data.rates };
            }
          })
          .catch((error) => {
            console.error('Помилка при виконанні запиту:', error);
            return undefined;
          });

        requests.push(request);
        startDate.setDate(startDate.getDate() + 1);
      }

      const responses = await Promise.all(requests);
      return responses.filter((response) => response !== undefined) as fixed[];
    } catch (error) {
      console.error('Помилка при виконанні запиту:', error);
      return [];
    }
  }
}

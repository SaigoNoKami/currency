import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { FixedService } from './fixed.service';
import { CurrencyService } from './currency/currency.service';
import { Response } from 'express';
import { MathService } from './math.service';
import { CurrencyCodeService } from './currency/currencyCode.service';
import { StatisticService } from './currency/statistic.service';
import { CreateRecordDto } from './dto/currency.dto';

@Controller('curses')
export class AppController {
  constructor(
    private readonly fixedService: FixedService,
    private readonly currencyService: CurrencyService,
    private readonly mathService: MathService,
    private readonly currencyCodeService: CurrencyCodeService,
    private readonly statisticService: StatisticService,
  ) {}

  @Get(':currency/:year/stats/count')
  async getExchangeRate(
    @Param('currency') currency: string,
    @Param('year') year: number,
    @Res() res: Response,
  ) {
    const isStat = await this.statisticService.findStaticByYear(year, currency);
    if (isStat) {
      const days = await this.currencyService.findYear(year, currency);
      console.log(days.length);
      const result = {
        daysAboveAverage: [],
        daysBelowAverage: [],
        average: isStat.average,
      };
      for (let i = 0; i < days.length; i++) {
        if (days[i].over_average === true) {
          result.daysAboveAverage.push({
            date: days[i].date,
            rate: days[i].exchange_rate,
          });
        } else {
          result.daysBelowAverage.push({
            date: days[i].date,
            rate: days[i].exchange_rate,
          });
        }
      }
      res.status(HttpStatus.OK).json(result);
      return;
    }
    const preResult = await this.currencyService.findStatsByYearAndCurrency(
      year,
      currency,
    );
    if (preResult.recordCount > 0) {
      this.statisticService.createRecord({
        year,
        currency_code: currency,
        average: preResult.averageRate,
      });
      res.status(HttpStatus.OK).json(preResult);
      return;
    } else {
      const days = await this.fixedService.getExchangeRate(year);
      let average: number = 0;
      const recordArray: CreateRecordDto[] = [];
      for (const element of days) {
        for (const key in element.rates) {
          if (key === currency) {
            average += element.rates[key];
          }
          recordArray.push({
            date: new Date(element.date),
            currency_code: key,
            exchange_rate: element.rates[key],
          });
        }
      }
      console.log(recordArray);
      this.currencyService.createMany(recordArray).then(() => {
        for (const element of result.daysAboveAverage) {
          this.currencyService.upStatistic(currency, element.date);
        }
      });
      //const isLeap: number = year % 4 ? 366 : 365;
      average /= days.length;
      const result = await this.mathService.getStatistic(
        days,
        currency,
        average,
      );
      this.statisticService.createRecord({
        year,
        currency_code: currency,
        average: result.average,
      });
      res.status(HttpStatus.OK).json(result);
    }
  }

  @Get('all')
  async findAll(@Res() res: Response) {
    const result: string[] = [];
    const codes = await this.currencyCodeService.findAll();
    for (const element of codes) {
      result.push(element.currency_code);
    }
    res.status(HttpStatus.OK).json(result);
  }
}

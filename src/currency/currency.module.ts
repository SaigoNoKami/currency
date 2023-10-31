import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CurrencyService } from './currency.service';
import {
  currencyCodeProviders,
  currencyProviders,
  statisticProviders,
} from './providers';
import { CurrencyCodeService } from './currencyCode.service';
import { StatisticService } from './statistic.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...currencyCodeProviders,
    ...currencyProviders,
    ...statisticProviders,
    CurrencyService,
    CurrencyCodeService,
    StatisticService,
  ],
  exports: [CurrencyService, CurrencyCodeService, StatisticService],
})
export class CurrencyModule {}

import { DataSource } from 'typeorm';
import { Currency } from 'src/database/entities/currency.entity';
import { CurrencyCode } from 'src/database/entities/currencyCode.entity';
import { Statistic } from 'src/database/entities/statistic.entity';

export const currencyProviders = [
  {
    provide: 'CURRENCY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Currency),
    inject: ['DATA_SOURCE'],
  },
];

export const currencyCodeProviders = [
  {
    provide: 'CURRENCYCODE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CurrencyCode),
    inject: ['DATA_SOURCE'],
  },
];
export const statisticProviders = [
  {
    provide: 'STATISTIC_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Statistic),
    inject: ['DATA_SOURCE'],
  },
];

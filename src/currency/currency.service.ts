import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Currency } from 'src/database/entities/currency.entity';
import { CreateRecordDto } from '../dto/currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @Inject('CURRENCY_REPOSITORY')
    private CurrencyRepository: Repository<Currency>,
  ) {}

  async findAll(): Promise<Currency[]> {
    return this.CurrencyRepository.find();
  }

  async findStatsByYearAndCurrency(
    year: number,
    currencyCode: string,
  ): Promise<{
    averageRate: number | null;
    daysAboveAverage: any[];
    daysBelowAverage: any[];
    recordCount: number | null;
  }> {
    const result = await this.CurrencyRepository.query(
      `SELECT
      (SELECT AVG(exchange_rate) FROM currency WHERE EXTRACT(YEAR FROM date) = $1 AND currency_code = $2) AS average_rate,
      ARRAY_AGG(DISTINCT date) AS dates,
      COUNT(*) AS total_records,
      ARRAY_AGG(date) FILTER (WHERE exchange_rate > (SELECT AVG(exchange_rate) FROM currency WHERE EXTRACT(YEAR FROM date) = $1 AND currency_code = $2)) AS above_average_days,
      ARRAY_AGG(date) FILTER (WHERE exchange_rate < (SELECT AVG(exchange_rate) FROM currency WHERE EXTRACT(YEAR FROM date) = $1 AND currency_code = $2)) AS below_average_days
    FROM currency
    WHERE EXTRACT(YEAR FROM date) = $1 
      AND currency_code = $2;
    
  `,
      [year, currencyCode],
    );
    const averageRate = parseFloat(result[0].average_rate);
    const recordCount = parseInt(result[0].total_records);
    const daysAboveAverage = result[0].above_average_days;
    const daysBelowAverage = result[0].below_average_days;

    return { averageRate, daysAboveAverage, daysBelowAverage, recordCount };
  }

  async findYear(year: number, currency_code: string): Promise<Currency[]> {
    const query = `
  SELECT *
  FROM currency
  WHERE EXTRACT(YEAR FROM date) = $1
    AND currency_code = $2
  ORDER BY date ASC
`;

    return await this.CurrencyRepository.query(query, [year, currency_code]);
  }

  async createRecord(createRecordDto: CreateRecordDto): Promise<Currency> {
    const { date, currency_code, exchange_rate } = createRecordDto;

    const newRecord = new Currency();
    newRecord.date = date;
    newRecord.currency_code = currency_code;
    newRecord.exchange_rate = exchange_rate;

    return await this.CurrencyRepository.save(newRecord);
  }

  async createMany(dtoArray: CreateRecordDto[]): Promise<any> {
    return await this.CurrencyRepository.createQueryBuilder()
      .insert()
      .into(Currency)
      .values(dtoArray)
      .execute();
  }

  async upStatistic(currency_code: string, date: Date): Promise<void> {
    try {
      const recordToUpdate = await this.CurrencyRepository.findOne({
        where: { currency_code, date },
      });
      if (!recordToUpdate) {
        throw new Error('Запись не найдена');
      }
      recordToUpdate.over_average = true;
      await this.CurrencyRepository.save(recordToUpdate);
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Statistic } from 'src/database/entities/statistic.entity';
import { CreateStatDto } from 'src/dto/stat.dto';

@Injectable()
export class StatisticService {
  constructor(
    @Inject('STATISTIC_REPOSITORY')
    private StatisticRepository: Repository<Statistic>,
  ) {}

  async findAll(): Promise<Statistic[]> {
    return this.StatisticRepository.find();
  }

  async findStaticByYear(year: number, currencyCode: string) {
    try {
      const records = await this.StatisticRepository.findOne({
        where: { year, currency_code: currencyCode },
      });
      return records;
    } catch (error) {
      throw error;
    }
  }

  async createRecord(createRecordDto: CreateStatDto): Promise<Statistic> {
    const { year, currency_code, average } = createRecordDto;

    const newRecord = new Statistic();
    newRecord.year = year;
    newRecord.currency_code = currency_code;
    newRecord.average = average;

    return await this.StatisticRepository.save(newRecord);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CurrencyCode } from 'src/database/entities/currencyCode.entity';

@Injectable()
export class CurrencyCodeService {
  constructor(
    @Inject('CURRENCYCODE_REPOSITORY')
    private CurrencyCodeRepository: Repository<CurrencyCode>,
  ) {}

  async findAll(): Promise<CurrencyCode[]> {
    return this.CurrencyCodeRepository.find();
  }
}

import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CurrencyCode {
  @PrimaryColumn()
  currency_code: string;
}

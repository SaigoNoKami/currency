import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryColumn()
  currency_code: string;

  @PrimaryColumn({ type: 'date' })
  date: Date;

  @Column('decimal', { precision: 10, scale: 4 })
  exchange_rate: number;

  @Column({ default: false })
  over_average: boolean;
}

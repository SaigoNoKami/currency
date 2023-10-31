import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryColumn()
  currency_code: string;

  @PrimaryColumn()
  year: number;

  @Column('decimal', { precision: 10, scale: 4 })
  average: number;
}

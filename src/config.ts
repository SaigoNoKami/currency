import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

const configService = new ConfigService();
export const ConfigEnv = {
  PORT: configService.get<number>('PORT'),
  DATABASE_HOST: configService.get<string>('DATABASE_HOST'),
  DATABASE_PORT: configService.get<number>('DATABASE_PORT'),
  DATABASE_USERNAME: configService.get<string>('DATABASE_USERNAME'),
  DATABASE_PASSWORD: configService.get<string>('DATABASE_PASSWORD'),
  FIXED_API_KEY: configService.get<string>('FIXED_API_KEY'),
};

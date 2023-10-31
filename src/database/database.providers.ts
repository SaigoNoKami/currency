import { DataSource } from 'typeorm';
import { ConfigEnv } from '../config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: ConfigEnv.DATABASE_PORT,
        username: ConfigEnv.DATABASE_USERNAME,
        password: ConfigEnv.DATABASE_PASSWORD,
        database: 'currency',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];

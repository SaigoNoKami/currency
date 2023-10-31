import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FixedService } from './fixed.service';
import { MathService } from './math.service';
import { CurrencyModule } from './currency/currency.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CurrencyModule,
  ],
  controllers: [AppController],
  providers: [FixedService, MathService],
})
export class AppModule {}

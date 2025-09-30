import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { utilities, WinstonModule } from 'nest-winston';
import { LogEnum } from 'src/enum/config.enum';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as Transports from 'winston/lib/winston/transports';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

function createDailyRotateTransport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const timestamp = configService.get(LogEnum.TIMESTAMP) === 'true';
        const combine: winston.Logform.Format[] = [];
        if (timestamp) {
          combine.push(winston.format.timestamp());
        }
        combine.push(utilities.format.nestLike());

        const consoleTransports = new Transports.Console({
          level: configService.get(LogEnum.LOG_LEVEL) || 'info',
          format: winston.format.combine(...combine),
        });

        return {
          transports: [
            consoleTransports,
            ...(configService.get(LogEnum.LOG_ON)
              ? [
                  createDailyRotateTransport('info', 'application'),
                  createDailyRotateTransport('warn', 'error'),
                ]
              : []),
          ],
        };
      },
    }),
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}

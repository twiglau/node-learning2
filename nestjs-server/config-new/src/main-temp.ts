import { NestFactory } from '@nestjs/core';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const winstonInstance = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      // 将日志记录到文件中
      new winston.transports.DailyRotateFile({
        level: 'warn',
        format: winston.format.combine(
          // winston.format.timestamp() 日志时间
          winston.format.timestamp(),
          winston.format.simple(),
        ),
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true, // 文件压缩
        maxSize: '20m',
        maxFiles: '15d', // 文件保存时间： 15天
      }),
      // 将日志记录到文件中
      new winston.transports.DailyRotateFile({
        level: 'info',
        format: winston.format.combine(
          // winston.format.timestamp() 日志时间
          winston.format.timestamp(),
          winston.format.simple(),
        ),
        dirname: 'logs',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true, // 文件压缩
        maxSize: '20m',
        maxFiles: '15d', // 文件保存时间： 15天
      }),
    ],
  });
  const winstonLogger = WinstonModule.createLogger({
    instance: winstonInstance,
  });

  const app = await NestFactory.create(AppModule, {
    // 1. 内置 Logger 系统
    // 关闭整个 nestjs 日志
    // logger: false,
    // logger: ['warn', 'error'],
    // bufferLogs: true

    // 2. winston, 重构 nest的Logger实例
    logger: winstonLogger,
  });
  app.setGlobalPrefix('/api/v1');
  // 传入logger 记录日志
  app.useGlobalFilters(new HttpExceptionFilter(winstonLogger));
  // 另外一种方式
  // const httpAdaptor = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionFilter(winstonLogger, httpAdaptor));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

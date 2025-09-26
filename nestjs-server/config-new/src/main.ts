import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 1. 内置 Logger 系统
    // 关闭整个 nestjs 日志
    // logger: false,
    // logger: ['warn', 'error'],
    // bufferLogs: true
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('/api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

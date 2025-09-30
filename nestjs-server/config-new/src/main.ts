import { NestFactory } from '@nestjs/core';
import { getServerConfig } from '../ormconfig';
import { AppModule } from './app.module';
import { setupApp } from './set-up';

async function bootstrap() {
  const serverConfig = getServerConfig();

  const app = await NestFactory.create(AppModule, {
    // 1. 内置 Logger 系统
    // 关闭整个 nestjs 日志
    // logger: false,
    // logger: ['warn', 'error'],
    // bufferLogs: true
    cors: true,
  });

  // 全局配置
  setupApp(app);

  const port =
    typeof serverConfig['APP_PORT'] === 'string'
      ? parseInt(serverConfig['APP_PORT'])
      : 3000;

  await app.listen(port);
}
void bootstrap();

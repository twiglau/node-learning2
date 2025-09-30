import { INestApplication, ValidationPipe } from '@nestjs/common';
import requestRateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getServerConfig } from 'ormconfig';

export const setupApp = (app: INestApplication) => {
  const serverConfig = getServerConfig();

  const flag: boolean = serverConfig['LOG_ON'] === 'true';
  if (flag) {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }
  app.setGlobalPrefix('api/v1');
  //全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上，不存在的字段
      whitelist: true,
    }),
  );
  // 1. app.useGlobalGuards()
  // 弊端： 无法使用DI -> 无法访问 userService

  // 2. app.useGlobalInterceptors(new SerializeInterceptor());

  // 3. helmet 头部安全
  app.use(helmet());

  // 4. ratelimit 限流
  app.use(
    requestRateLimit({
      windowMs: 1 * 60 * 1000, // 1 分钟内
      max: 300, // limit each IP to 300 requests per windowMs
    }),
  );
};

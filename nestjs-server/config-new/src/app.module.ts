import { Global, Logger, LoggerService, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsModule } from './logs/logs.module';
import { UserModule } from './user/user.module';

import { RedisModule } from '@nestjs-modules/ioredis';
import { connectionParams } from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { ConfigEnum } from './enum/config.enum';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';

// 1. 配置文件 方法一
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DB_PORT: Joi.number().default(3306),
  DB_HOST: Joi.alternatives().try(Joi.string().ip(), Joi.string().domain()),
  DB_TYPE: Joi.string().valid('mysql', 'postgres'),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  LOG_ON: Joi.boolean(),
  LOG_LEVEL: Joi.string(),
});

// 如果要全局注册使用 logger, 需要在 app.module.ts 中
// 1. 使用 @Global() 注解，使 app 模块变成全局模块，进行全局注册，
// 2. 使用 exports 将 logger 导出使用
@Global()
@Module({
  imports: [
    // 1. 环境配置，及校验
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [
        () => {
          const values = dotenv.config({ path: '.env' });

          const { error } = schema.validate(values?.parsed, {
            // 允许未知的环境变量
            allowUnknown: true,
            // 如果有错误，不要立即停止，而是收集所有错误
            abortEarly: false,
          });
          if (error) {
            throw new Error(
              `Validation failed - Is there an environment variable missing? ${error.message}`,
            );
          }
          return values;
        },
      ],
      validationSchema: schema,
    }),
    // 2. Redis 集成
    RedisModule.forRootAsync({
      inject: [ConfigService, Logger],
      useFactory: (configService: ConfigService, logger: LoggerService) => {
        const host = configService.get(ConfigEnum.REDIS_HOST);
        const port = configService.get(ConfigEnum.REDIS_PORT);
        const password = configService.get(ConfigEnum.REDIS_PASSWORD);

        // const url = password
        //   ? `redis://${password}@${host}:${port}`
        //   : `redis://${host}:${port}`;

        const url = `redis://${host}:${port}`;
        return {
          config: {
            url,
            password,
            reconnectOnError: (err) => {
              logger.error(`Redis Connection error: ${err}`);
              return true;
            },
          },
        };
      },
    }),
    // 3. 数据库连接
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [AppController, RolesController],
  providers: [AppService, Logger, RolesService],
  exports: [Logger],
})
export class AppModule {}

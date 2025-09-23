import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import Configuration from './configuration';
import Joi from 'joi';
import { UserModule } from './user/user.module';

// 1. 配置文件 方法一
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 1. 配置文件 方法一
      // envFilePath,
      // load: [() => dotenv.config({ path: '.env' })],
      // 2. 配置文件 方法二
      // load: [Configuration],
      // 3. 配置文件 方法三
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PROT: Joi.number().default(3306),
        DB_URL: Joi.string().domain(),
        DB_HOST: Joi.string().ip(),
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

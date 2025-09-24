import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import Configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { ConfigEnum } from './enum/config.enum';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          host: config.get(ConfigEnum.DB_HOST),
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'testdb',
          entities: [],
          // 同步本地的 schema 与 数据库 -> 初始化的时候去使用
          synchronize: true,
          logging: ['error'],
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'root',
    //   database: 'testdb',
    //   entities: [],
    //   // 同步本地的 schema 与 数据库 -> 初始化的时候去使用
    //   synchronize: true,
    //   logging: ['error'],
    // }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

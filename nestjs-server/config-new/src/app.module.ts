import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import Configuration from './configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import { ConfigEnum } from './enum/config.enum';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
import { Profile } from './user/profile.entity';
import { User } from './user/user.entity';
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
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.string().ip(),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Logs, Roles],
          // 同步本地的schema与数据库 -> 初始化的时候去使用
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          logging: ['error'],
        } as TypeOrmModuleOptions;
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

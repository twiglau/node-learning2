import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { CacheModule } from './common/cache/cache.module';
import { AppController } from './app.controller';
import { MailModule } from './common/mail/mail.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UserSchema } from './user/user.schema';
// import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { User } from './user/user.entity';
// import { PrismaModule } from './database/prisma/prisma.module';
@Module({
  imports: [
    ConfigModule,
    LogsModule,
    CacheModule,
    MailModule,
    // MongooseModule.forRoot('mongodb://root:example@localhost:27017/nest'),
    // MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) =>
    //     ({
    //       type: configService.get('DB_TYPE'),
    //       host: configService.get('DB_HOST'),
    //       port: configService.get('DB_PROT'),
    //       username: configService.get('DB_USERNAME'),
    //       password: configService.get('DB_PASSWORD'),
    //       database: configService.get('DB_DATABASE'),
    //       autoLoadEntities: Boolean(configService.get('DB_AUTOLOAD')) || false,
    //       synchronize: Boolean(configService.get('DB_SYNC')) || false,
    //     }) as TypeOrmModuleOptions,
    // }),
    // TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

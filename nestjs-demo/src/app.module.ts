import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { CacheModule } from './common/cache/cache.module';
import { AppController } from './app.controller';
import { MailModule } from './common/mail/mail.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { PrismaService } from './database/prisma/prisma.service';

// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user/user.entity';
// import { TypeOrmConfigService } from './database/typeorm/typeorm-config.service';
// import { DataSource } from 'typeorm';
// import { AppService } from './app.service';

import { MongooseModule } from './database/mongoose/mongoose.module';
import { UserSchema } from './user/user.schema';
import { MongooseConfigService } from './database/mongoose/mongoose-config.service';
// import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { User } from './user/user.entity';
// const connections = new Map<string, DataSource>();

@Module({
  imports: [
    ConfigModule,
    LogsModule,
    CacheModule,
    MailModule,
    // 1. mongoose
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    // 2. typeorm
    // TypeOrmModule.forRootAsync({
    //   useClass: TypeOrmConfigService,
    //   dataSourceFactory: async (options) => {
    //     console.log('options:', options);
    //     const tenantId = options?.['tenantId'];
    //     if (tenantId && connections.has(tenantId)) {
    //       return connections.get(tenantId)!;
    //     }
    //     const dataSource = await new DataSource(options!).initialize();
    //     connections.set(tenantId, dataSource);
    //     return dataSource;
    //   },
    //   inject: [],
    //   extraProviders: [],
    // }),
    // TypeOrmModule.forFeature([User]),
    // 3. prisma
    PrismaModule.forRootAsync({
      name: 'prisma1',
      useClass: PrismaService,
    }),
  ],
  controllers: [AppController],
  // providers: [
  //   AppService,
  //   { provide: 'TYPEORM_CONNECTIONS', useValue: connections },
  // ],
})
export class AppModule {}

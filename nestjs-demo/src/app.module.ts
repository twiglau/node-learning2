import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { CacheModule } from './common/cache/cache.module';
import { AppController } from './app.controller';
import { MailModule } from './common/mail/mail.module';

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule,
    LogsModule,
    CacheModule,
    MailModule,
    // 1. mongoose
    DatabaseModule,
    // 3. prisma
  ],
  controllers: [AppController],
  // providers: [
  //   AppService,
  //   { provide: 'TYPEORM_CONNECTIONS', useValue: connections },
  // ],
})
export class AppModule {}

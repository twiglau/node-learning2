import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { CacheModule } from './common/cache/cache.module';
@Module({
  imports: [ConfigModule, LogsModule, CacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

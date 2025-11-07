import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { CacheModule } from './common/cache/cache.module';
import { AppController } from './app.controller';
import { MailModule } from './common/mail/mail.module';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { getEnvs } from './utils/get-envs';
import { toBoolean } from './utils/format';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtGuard } from './common/guard/jwt.guard';

const conditionalImports = () => {
  const imports: any[] = [];
  const parsedConfig = getEnvs();
  if (toBoolean(parsedConfig['MAIL_ON'])) {
    imports.push(MailModule);
  }

  return imports;
};

@Module({
  imports: [
    ConfigModule,
    LogsModule,
    CacheModule,
    DatabaseModule,
    UserModule,
    ...conditionalImports(),
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtGuard, // 在自定义的guard中，引入某些实例
    // },
  ],
})
export class AppModule {}

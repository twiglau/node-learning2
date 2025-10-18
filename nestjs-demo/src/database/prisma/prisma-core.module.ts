import {
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { PrismaModuleOptions } from './prisma-options.interface';
// import { PrismaClient } from 'generated/prisma';
import { PrismaClient as MysqlClient } from 'prisma/client/mysql';
import { PrismaClient as PostgresqlClient } from 'prisma/client/postgresql';
import { getDBType } from './prisma-utils';
import { PRISMA_CLIENT } from './prisma.constants';

@Module({})
@Global()
export class PrismaCoreModule implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    console.log('signal:', signal);
  }

  static forRoot(options: PrismaModuleOptions) {
    const prismaClientProvider: Provider = {
      provide: PRISMA_CLIENT,
      useFactory: () => {
        const url = options.url;
        const dbType = getDBType(url!);
        const _options = {
          datasourceUrl: options.url,
          ...options.options,
        };
        if (dbType === 'mysql') {
          return new MysqlClient(_options);
        } else if (dbType === 'postgresql') {
          return new PostgresqlClient(_options);
        } else {
          throw new Error(`Unsupported database type: ${dbType}`);
        }
      },
    };
    return {
      module: PrismaCoreModule,
      providers: [prismaClientProvider],
      exports: [prismaClientProvider],
    };
  }
  static forRootAsync(options: PrismaModuleOptions) {}
}

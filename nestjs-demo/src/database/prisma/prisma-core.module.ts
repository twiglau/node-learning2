import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import {
  PrismaModuleAsyncOptions,
  PrismaModuleOptions,
} from './prisma-options.interface';
import { PrismaClient as MysqlClient } from 'prisma/client/mysql';
import { PrismaClient as PostgresqlClient } from 'prisma/client/postgresql';
import { getDBType } from './prisma-utils';
import { PRISMA_CONNECTION_NAME, PRISMA_CONNECTIONS } from './prisma.constants';
import { catchError, defer, lastValueFrom } from 'rxjs';
import { handleRetry } from './prisma-utils';

@Module({})
@Global()
export class PrismaCoreModule implements OnApplicationShutdown {
  // 连接数
  private static connections: Record<string, any> = {};

  onApplicationShutdown() {
    if (
      PrismaCoreModule.connections &&
      Object.keys(PrismaCoreModule.connections).length > 0
    ) {
      for (const key of Object.keys(PrismaCoreModule.connections)) {
        const connection = PrismaCoreModule.connections[key];
        if (connection && typeof connection.$disconnect === 'function') {
          connection.$disconnect();
        }
      }
    }
  }

  static forRoot(_options: PrismaModuleOptions) {
    const {
      url,
      options = {},
      name,
      retryAttempts,
      retryDelay,
      connectionErrorFactory,
      connectionFactory,
    } = _options;

    let newOptions = {
      datasourceUrl: url,
    };
    if (Object.keys(options).length) {
      newOptions = { ...newOptions, ...options };
    }

    const dbType = getDBType(url!);
    let _prismaClient;
    if (dbType === 'mysql') {
      _prismaClient = MysqlClient;
    } else if (dbType === 'postgresql') {
      _prismaClient = PostgresqlClient;
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }

    const providerName = name || PRISMA_CONNECTION_NAME;
    const prismaConnectionErrorFactory =
      connectionErrorFactory || ((err) => err);
    const prismaConnectionFactory =
      connectionFactory ||
      (async (clientOptions) => await new _prismaClient(clientOptions));

    const prismaClientProvider: Provider = {
      provide: providerName,
      useFactory: async () => {
        // 加入错误重试
        if (this.connections[url!]) {
          return this.connections[url!];
        }
        const client = await prismaConnectionFactory(newOptions, name ?? '');
        this.connections[url!] = client;

        return lastValueFrom(
          defer(() => client.$connect()).pipe(
            handleRetry(retryAttempts!, retryDelay!),
            catchError((err) => {
              throw prismaConnectionErrorFactory(err);
            }),
          ),
        ).then(() => client);
      },
    };
    const connectionsProvider = {
      provide: PRISMA_CONNECTIONS,
      useValue: this.connections,
    };
    return {
      module: PrismaCoreModule,
      providers: [prismaClientProvider, connectionsProvider],
      exports: [prismaClientProvider, connectionsProvider],
    };
  }
  static forRootAsync(_options: PrismaModuleAsyncOptions): DynamicModule {
    const provideName = _options.name || PRISMA_CONNECTION_NAME;

    const prismaClientProvider: Provider = {
      provide: provideName,
      useFactory: (prismaModuleOptions: PrismaModuleOptions) => {
        if (!prismaModuleOptions) return;
        const {
          url,
          options = {},
          retryAttempts = 10,
          retryDelay = 3000,
          connectionFactory,
          connectionErrorFactory,
        } = prismaModuleOptions;
        let newOptions = {
          datasourceUrl: url,
        };
        if (!Object.keys(options).length) {
          newOptions = { ...newOptions, ...options };
        }

        const dbType = getDBType(url!);
        let _prismaClient;
        if (dbType === 'mysql') {
          _prismaClient = MysqlClient;
        } else if (dbType === 'postgresql') {
          _prismaClient = PostgresqlClient;
        } else {
          throw new Error(`Unsupported database type: ${dbType}`);
        }

        const prismaConnectionErrorFactory =
          connectionErrorFactory || ((err) => err);
        const prismaConnectionFactory =
          connectionFactory ||
          (async (clientOptions) => await new _prismaClient(clientOptions));
      },
    };

    return {
      module: PrismaCoreModule,
      providers: [],
      exports: [],
    };
  }
}

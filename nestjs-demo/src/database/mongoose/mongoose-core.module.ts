import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import {
  getConnectionToken,
  MongooseModuleAsyncOptions,
  MongooseModuleFactoryOptions,
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import mongoose, { Connection, ConnectOptions } from 'mongoose';
import {
  MONGOOSE_CONNECTION_NAME,
  MONGOOSE_MODULE_OPTIONS,
} from './mongoose.constants';
import { catchError, defer, lastValueFrom } from 'rxjs';
import { handleRetry } from './mongoose.utils';
import { ModuleRef } from '@nestjs/core';

@Global()
@Module({})
export class MongooseCoreModule implements OnApplicationShutdown {
  private static connections: Record<string, mongoose.Connection> = {};

  constructor(
    @Inject(MONGOOSE_CONNECTION_NAME) private readonly connectionName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onApplicationShutdown() {
    const connection = this.moduleRef.get<any>(this.connectionName);

    if (connection) {
      await connection.close();
    }

    if (Object.keys(MongooseCoreModule.connections).length > 0) {
      // 销毁所有 mongoose connection
      for (const key of Object.keys(MongooseCoreModule.connections)) {
        const client = MongooseCoreModule.connections[key];
        if (client && typeof client.close === 'function') {
          client.close();
        }
      }
    }
  }

  static forRoot(uri: string, options: MongooseModuleOptions = {}) {
    const {
      retryAttempts,
      retryDelay,
      connectionName,
      connectionFactory,
      connectionErrorFactory,
      lazyConnection,
      onConnectionCreate,
      ...mongooseOptions
    } = options;

    const mongooseConnectionFactory =
      connectionFactory || ((connection) => connection);

    const mongooseConnectionError =
      connectionErrorFactory || ((error) => error);

    const mongooseConnectionName = getConnectionToken(connectionName);

    const mongooseConnectionNameProvider = {
      provide: MONGOOSE_CONNECTION_NAME,
      useValue: mongooseConnectionName,
    };

    const connectionProvider = {
      provide: mongooseConnectionName,
      useFactory: async (): Promise<any> =>
        await lastValueFrom(
          defer(async () =>
            mongooseConnectionFactory(
              await this.createMongooseConnection(uri, mongooseOptions, {
                lazyConnection,
                onConnectionCreate,
              }),
              mongooseConnectionName,
            ),
          ).pipe(
            handleRetry(retryAttempts, retryDelay),
            catchError((error) => {
              throw mongooseConnectionError(error);
            }),
          ),
        ),
    };

    return {
      module: MongooseCoreModule,
      providers: [connectionProvider, mongooseConnectionNameProvider],
      exports: [connectionProvider],
    };
  }
  static forRootAsync(options: MongooseModuleAsyncOptions): DynamicModule {
    const mongooseConnectionName = getConnectionToken(options.connectionName);

    const mongooseConnectionNameProvider = {
      provide: MONGOOSE_CONNECTION_NAME,
      useValue: mongooseConnectionName,
    };

    const connectionProvider = {
      provide: mongooseConnectionName,
      useFactory: async (
        mongooseModuleOptions: MongooseModuleFactoryOptions,
      ): Promise<any> => {},
      inject: [MONGOOSE_MODULE_OPTIONS],
    };
  }

  private static createAsyncProviders(
    options: MongooseModuleAsyncOptions,
  ): Provider[] {
    return [];
  }

  private static createAsyncOptionsProvider(
    options: MongooseModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MONGOOSE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<MongooseOptionsFactory>,
    ];
    return {
      provide: MONGOOSE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: MongooseOptionsFactory) =>
        await optionsFactory.createMongooseOptions(),
      inject,
    };
  }

  private static async createMongooseConnection(
    uri: string,
    mongooseOptions: ConnectOptions,
    factoryOptions: {
      lazyConnection?: boolean;
      onConnectionCreate?: MongooseModuleOptions['onConnectionCreate'];
    },
  ): Promise<Connection> {
    if (this.connections[uri]) {
      return this.connections[uri];
    }

    const connection = mongoose.createConnection(uri, mongooseOptions);

    this.connections[uri] = connection;

    if (factoryOptions?.lazyConnection) {
      return connection;
    }

    factoryOptions?.onConnectionCreate?.(connection);

    return connection.asPromise();
  }
}

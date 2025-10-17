import {
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { PrismaModuleOptions } from './prisma-options.interface';
import { PrismaClient } from 'generated/prisma';

@Module({})
@Global()
export class PrismaCoreModule implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    console.log('signal:', signal);
  }

  static forRoot(options: PrismaModuleOptions) {
    const prismaClientProvider: Provider = {
      provide: PrismaClient,
      useFactory: () => {
        return new PrismaClient({
          datasourceUrl: options.url,
        });
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

import { DynamicModule, Module } from '@nestjs/common';
import { PrismaModuleOptions } from './prisma-options.interface';
import { PrismaCoreModule } from './prisma-core.module';
// import { PrismaService } from './prisma.service';

@Module({})
export class PrismaModule {
  static forRoot(options: PrismaModuleOptions): DynamicModule;
  static forRoot(url: string): DynamicModule;
  static forRoot(arg: any): DynamicModule {
    let _options: PrismaModuleOptions;
    if (typeof arg === 'string') {
      _options = { url: arg };
    } else {
      _options = arg;
    }
    return {
      module: PrismaModule,
      imports: [PrismaCoreModule.forRoot(_options)],
    };
  }
  static forRootAsync() {
    return {
      module: PrismaModule,
      providers: [],
      exports: [],
    };
  }
}

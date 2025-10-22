import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TYPEORM_DATABASE } from '../database-constants';
import { TypeOrmConfigService } from './typeorm-config.service';
import { TypeormProvider } from './typeorm.provider';
import { TYPEORM_CONNECTIONS } from './typeorm.constants';
import { User } from '@/user/user.entity';

const connections = new Map<string, DataSource>();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: TYPEORM_DATABASE,
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        const tenantId = options['tenantId'] || 'default';
        if (tenantId && connections.has(tenantId)) {
          return connections.get(tenantId) as DataSource;
        }

        const dataSource = await new DataSource(options).initialize();
        connections.set(tenantId, dataSource);
        return dataSource;
      },
      inject: [],
      extraProviders: [],
    }),
    // 如果不指定 name, 就会找不到 对应的实例
    TypeOrmModule.forFeature([User], TYPEORM_DATABASE),
  ],
  providers: [
    TypeormProvider,
    {
      provide: TYPEORM_CONNECTIONS,
      useValue: connections,
    },
  ],
})
export class TypeormCommonModule {}

import { Inject, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class AppService implements OnApplicationShutdown {
  constructor(
    @Inject('TYPEORM_CONNECTIONS') private connections: Map<string, DataSource>,
  ) {}
  onApplicationShutdown() {
    // 如果App关闭，要释放数据库连接
    if (this.connections.size > 0) {
      for (const key in this.connections.keys()) {
        this.connections.get(key)?.destroy();
      }
    }
  }
}

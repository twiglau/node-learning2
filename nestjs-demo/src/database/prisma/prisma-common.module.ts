import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { PRISMA_DATABASE } from '../database-constants';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      name: PRISMA_DATABASE,
      useClass: PrismaService,
    }),
  ],
})
export class PrismaCommonModule {}

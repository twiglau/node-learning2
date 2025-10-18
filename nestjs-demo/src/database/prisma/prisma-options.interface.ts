import { PrismaClientOptions } from '@prisma/client';

export interface PrismaModuleOptions {
  url?: string;
  options?: PrismaClientOptions;
}

import { Prisma } from 'generated/prisma';

export interface PrismaModuleOptions {
  url?: string;
  options?: Prisma.PrismaClientOptions;
}

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import {
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from './prisma-options.interface';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit, PrismaOptionsFactory {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly configService: ConfigService,
  ) {}
  createPrismaModuleOptions():
    | Promise<PrismaModuleOptions>
    | PrismaModuleOptions {}
  async onModuleInit() {}
}

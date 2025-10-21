// import { InjectRedis } from '@nestjs-modules/ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Inject, Version } from '@nestjs/common';
import { PrismaClient } from 'prisma/client/mysql';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './user/user.entity';
// import { Repository } from 'typeorm';
// import { PrismaService } from './database/prisma/prisma.service';
// import Redis from 'ioredis';

@Controller()
export class AppController {
  //   constructor(@InjectRedis() private readonly redis: Redis) {}
  constructor(
    private readonly mailerService: MailerService,
    @Inject('prisma1') private prismaService: PrismaClient,
    // private readonly prismaService: PrismaService,
    // @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectModel('User') private userModel: Model<'User'>,
  ) {}

  @Get('/prisma')
  @Version('1')
  async getHello() {
    // 1. prisma
    const res = this.prismaService.user.findMany();
    return res;
    // const res = this.prismaClient.user.findMany();
    // return res;
    // 2. typeorm
    // const res = await this.userRepository.find();
    // return res;
    // 3. mongoose
    // const userModel = await this.userModel.find();
    // return userModel;
  }

  @Get()
  @Version('2')
  async getHelloV2() {
    // const res = await this.redis.get('token');
    // return res;
    // const users = await this.userRepository.find();
    // return users;
  }
  @Get('/mail')
  @Version('1')
  sendMail() {
    this.mailerService
      .sendMail({
        to: 'twiglau@163.com',
        from: 'twiglau@qq.com',
        subject: 'Testing Net with template ~',
        template: 'welcome',
        context: {
          name: 'aaaaaa',
        },
      })
      .then(() => {})
      .catch(() => {});
  }
}

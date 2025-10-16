// import { InjectRedis } from '@nestjs-modules/ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Version } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
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
    // private readonly prismaService: PrismaService,
    // @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectModel('User') private userModel: Model<'User'>,
    private userRepository: UserRepository,
  ) {}

  @Get('/prisma')
  @Version('1')
  async getHello() {
    // 1. prisma
    // const res = this.prismaService.user.findMany();
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
    const userRepository = this.userRepository.getRepository();
    const users = await userRepository.find();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return users;
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

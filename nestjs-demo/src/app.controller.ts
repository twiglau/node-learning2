// import { InjectRedis } from '@nestjs-modules/ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Version } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Repository } from 'typeorm';
// import { PrismaService } from './database/prisma/prisma.service';
// import Redis from 'ioredis';

@Controller()
export class AppController {
  //   constructor(@InjectRedis() private readonly redis: Redis) {}
  constructor(
    private readonly mailerService: MailerService,
    // private readonly prismaService: PrismaService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @Get('/prisma')
  @Version('1')
  async getHello() {
    // const res = this.prismaService.user.findMany();
    // return res;
    const res = await this.userRepository.find();
    return res;
  }

  @Get()
  @Version('2')
  async getHelloV2() {
    // const res = await this.redis.get('token');
    // return res;
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

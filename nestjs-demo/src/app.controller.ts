// import { InjectRedis } from '@nestjs-modules/ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Version } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

@Controller()
export class AppController {
  //   constructor(@InjectRedis() private readonly redis: Redis) {}
  constructor(
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
    // @Inject('prisma1') private prismaService: PrismaClient,
    // @Inject(PRISMA_CONNECTIONS)
    // private connections: Record<string, PrismaClient>,
    // private readonly prismaService: PrismaService,
    // @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectModel('User') private userModel: Model<'User'>,
  ) {}

  @Get('/prisma')
  @Version('1')
  async getHello() {
    // 1. prisma
    // try {
    //   const res = await this.prismaService.user.findMany();
    //   return res;
    // } catch (error) {
    //   console.log('error:', error);
    // }
    // const res = this.prismaClient.user.findMany();
    // return res;
    // 2. typeorm
    // const res = await this.userRepository.find();
    // return res;
    // 3. mongoose
    // const userModel = await this.userModel.find();
    // return userModel;
  }

  @Get('/test')
  @Version('2')
  async getHelloV2() {
    const cache = await this.cacheManger.get('test-id');
    console.log('cache:', cache);
    if (cache) {
      return cache as string;
    } else {
      await this.cacheManger.set('test-id', 'test-11', 15 * 60 * 1000);
      return 'test-11';
    }
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

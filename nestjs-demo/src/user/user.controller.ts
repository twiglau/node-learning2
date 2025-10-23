import { Controller, Get, Version } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Get('/multi')
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
    const res = await this.userRepository.find('ass');
    return res;
    // 3. mongoose
    // const userModel = await this.userModel.find();
    // return userModel;
  }
}

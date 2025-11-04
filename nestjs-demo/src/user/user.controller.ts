import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Serialize } from '@/common/decorators/serialize.decorator';
import { PublicUserDto } from '@/auth/dto/public-dto';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Post()
  @Serialize(PublicUserDto)
  create(@Body() createUserDto: CreateUserDto) {
    // 该参数没有校验，是因为变为 可选的了
    return this.userRepository.create(createUserDto);
  }

  @Get('/multi')
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

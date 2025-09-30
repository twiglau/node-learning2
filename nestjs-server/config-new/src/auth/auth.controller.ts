import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('/signin')
  signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;

    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不能为空', 400);
    // }
    // // 正则 -> todo
    // if (typeof username !== 'string' || typeof password !== 'string') {
    //   throw new HttpException('用户名或密码格式不正确', 400);
    // }
    // if (
    //   !(typeof username == 'string' && username.length >= 6) ||
    //   !(typeof password === 'string' && password.length >= 6)
    // ) {
    //   throw new HttpException('用户名密码必须长度超过6', 400);
    // }

    return this.authService.signup(username, password);
  }
}

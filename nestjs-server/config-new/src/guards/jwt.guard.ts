import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import Redis from 'ioredis';
import { verify } from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { ConfigEnum } from 'src/enum/config.enum';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // custom logic
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await verify(
      token,
      this.configService.get(ConfigEnum.SECRET),
    );
    console.log('token:', payload);
    const username = payload['username'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const tokenCache = username ? await this.redis.get(username) : null;
    if (!payload || !username || tokenCache !== token) {
      throw new UnauthorizedException();
    }
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    return parentCanActivate;
  }
}

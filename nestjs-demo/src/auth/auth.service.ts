import { UserRepository } from '@/user/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}
  signin(username: string, password: string) {
    return '登录：' + username + ' ' + password;
  }
  signup(username: string, password: string) {
    return '注册：' + username + ' ' + password;
  }
}

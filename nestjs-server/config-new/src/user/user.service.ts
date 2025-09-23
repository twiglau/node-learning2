import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers() {
    return {
      code: 200,
      data: [],
      msg: '获取成功',
    };
  }
}

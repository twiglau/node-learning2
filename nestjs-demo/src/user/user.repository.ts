import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(User, 'mysql1') private userRepository1: Repository<User>,
    @Inject(REQUEST) private request: Request,
  ) {}

  getRepository(): any {
    const { query } = this.request;
    if (query.db === 'mysql1') {
      return this.userRepository1;
    } else {
      return this.userRepository;
    }
  }
}

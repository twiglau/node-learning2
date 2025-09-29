import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from 'src/logs/logs.entity';
import { Repository } from 'typeorm';
import { conditionUtils } from '../utils/db.helper';
import * as userDto from './dto/get-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll(query: userDto.getUserDto) {
    const { limit = 10, page = 1, username, gender, role } = query;

    const take = limit;
    const skip = (page - 1) * limit;
    // SELECT * FROM user u, profile p, role r WHERE u.id = p.uid AND
    // u.id = r.uid AND ...

    // SELECT * FROM user u LEFT JOIN profile p ON u.id = p.uid LEFT JOIN
    // role r ON u.id = r.uid WHERE ...

    // 分页 SQL -> LIMIT 10 OFFSET 10
    // 方法一：
    // return this.userRepository.find({
    //   select: { id: true, username: true, profile: { gender: true } },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: { gender },
    //     roles: { id: role },
    //   },
    //   take: limit,
    //   skip: (page - 1) * limit,
    // });
    const params = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };

    // 方法二：
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      // inner join vs left join vs outer join
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');

    const newQuery = conditionUtils<User>(queryBuilder, params);
    // 后面的 .where 会替换前面的 .where
    // if (username) {
    //   queryBuilder.where('user.username = :username', { username });
    // } else {
    //   queryBuilder.where('user.username IS NOT NULL');
    // }
    // if (gender) {
    //   queryBuilder.where('profile.gender = :gender', { gender });
    // } else {
    //   queryBuilder.where('profile.gender IS NOT NULL');
    // }
    // if (role) {
    //   queryBuilder.where('roles.id = :role', { role });
    // } else {
    //   queryBuilder.where('roles.id IS NOT NULL');
    // }

    return newQuery.take(limit).skip(skip).getRawMany();
  }
  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  create(user: User) {
    return this.userRepository.save(user);
  }
  update(id: number, user: User) {
    return this.userRepository.update(id, user);
  }
  remove(id: number) {
    return this.userRepository.delete(id);
  }
  findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: { profile: true },
    });
  }
  async findUserLogs(id: number) {
    const userInfo = await this.findOne(id);
    return this.logsRepository.find({
      where: { user: userInfo! },
      relations: { user: true },
    });
  }
  async findLogsByGroup(id: number) {
    // SELECT logs.result as result, COUNT(logs.result) from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;

    // return this.logsRepository.query('SELECT * FROM logs');

    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('logs.result')
      .orderBy('count', 'DESC')
      .addOrderBy('result', 'DESC')
      .offset(2)
      .limit(3)
      .getRawMany();
  }
}

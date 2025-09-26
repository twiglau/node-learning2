import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from 'src/logs/logs.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll() {
    return this.userRepository.find();
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

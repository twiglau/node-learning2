import { InjectRepository } from '@nestjs/typeorm';
import { UserAbstractRepository } from '../user.abstract.repository';
import { User } from '../user.entity';
import { TYPEORM_DATABASE } from '@/database/database-constants';
import { Repository } from 'typeorm';

export class UserTypeormRepository implements UserAbstractRepository {
  // 需要指定 TYPEORM_DATABASE
  // Typeorm 异步初始化，不指定，会找不到对应实例
  constructor(
    @InjectRepository(User, TYPEORM_DATABASE)
    private readonly user: Repository<User>,
  ) {}

  find(): Promise<any[]> {
    return this.user.find();
  }
  create(userObj: any): Promise<any> {
    return this.user.save(userObj);
  }
  update(userObj: any): Promise<any> {
    return this.user.update(userObj.id, userObj);
  }
  delete(id: string): Promise<any> {
    return this.user.delete(id);
  }
}

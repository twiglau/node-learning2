import { InjectRepository } from '@nestjs/typeorm';
import { UserAbstractRepository } from '../user.abstract.repository';
import { User } from '../user.entity';
import { TYPEORM_DATABASE } from '@/database/database-constants';
import { Repository } from 'typeorm';

export class UserTypeormRepository implements UserAbstractRepository {
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

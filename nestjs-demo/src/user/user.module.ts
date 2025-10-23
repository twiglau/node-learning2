import { Module } from '@nestjs/common';
import { getEnvs } from '@/utils/get-envs';
import { toBoolean } from '@/utils/format';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TYPEORM_DATABASE } from '@/database/database-constants';
import { MongooseModule } from '@nestjs/mongoose';
import { User as MongooseUser, UserSchema } from './user.schema';
import { UserTypeormRepository } from './repository/user.typeorm.repository';
import { UserMongooseRepository } from './repository/user.mongoose.repository';
import { UserPrismaRepository } from './repository/user.prisma.repository';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

const parseConfig = getEnvs();
const tenantMode = toBoolean(parseConfig['TENANT_MODE']);
const tenantDBType = parseConfig['TENANT_DB_TYPE']?.split(',') || [];

const imports = tenantMode
  ? tenantDBType
      ?.map((db) => {
        switch (db) {
          case 'typeorm':
            // 如果不指定 name, 就会找不到 对应的实例
            return TypeOrmModule.forFeature([User], TYPEORM_DATABASE);
          case 'mongoose':
            return MongooseModule.forFeature([
              { name: MongooseUser.name, schema: UserSchema },
            ]);
          default:
            return null;
        }
      })
      ?.filter(Boolean)
  : [];

const providers = tenantMode
  ? tenantDBType
      .map((db) => {
        switch (db) {
          case 'typeorm':
            return UserTypeormRepository;
          case 'mongoose':
            return UserMongooseRepository;
          case 'prisma':
            return UserPrismaRepository;
          default:
            return null;
        }
      })
      ?.filter(Boolean)
  : [UserPrismaRepository];

@Module({
  imports,
  providers: [...providers, UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}

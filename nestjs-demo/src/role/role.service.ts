import { PRISMA_DATABASE } from '@/database/database-constants';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'prisma/client/postgresql';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  async create(createRoleDto: CreateRoleDto) {
    // TODO

    const createRolePermissions = (permissions) => {
      return {
        create: permissions?.map((permission) => ({
          permission: {
            // 先查询是否存在，如果通过唯一name查询存在，直接使用；
            // 如果不存在，则创建；
            connectOrCreate: {
              where: {
                name: permission.name,
              },
              create: {
                ...permission,
              },
            },
          },
        })),
      };
    };
    const createRolePolicies = (policies) => {
      return {
        create: policies?.map((policy) => {
          let whereCondition;
          if (policy.id) {
            whereCondition = { id: policy.id };
          } else {
            const encode = Buffer.from(JSON.stringify(policy)).toString(
              'base64',
            );
            whereCondition = { encode };
            policy.encode = encode;
          }
          return {
            policy: {
              connectOrCreate: {
                where: whereCondition,
                create: {
                  ...policy,
                },
              },
            },
          };
        }),
      };
    };
    return await this.prismaClient.$transaction(
      async (prisma: PrismaClient) => {
        const { permissions, policies, ...restData } = createRoleDto;
        return prisma.role.create({
          data: {
            ...restData,
            RolePermissions: createRolePermissions(permissions), // data_End
            RolePolicy: createRolePolicies(policies),
          },
        });
      },
    );
  }
  findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    return this.prismaClient.role.findMany({
      skip,
      take: limit,
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        RolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prismaClient.role.findUnique({
      where: { id },
      include: {
        RolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  findAllByIds(ids: number[]) {
    return this.prismaClient.role.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        RolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  update(id: number, updateRoleDto: any) {
    return this.prismaClient.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  remove(id: number) {
    return this.prismaClient.role.delete({
      where: { id },
    });
  }
}

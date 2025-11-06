import { Transform } from 'class-transformer';
import { CreateRoleDto } from './create-role.dto';

export class PublicRoleDto extends CreateRoleDto {
  //TODO
  @Transform(({ value }) => {
    return value.map((permission) => permission.permissions.name);
  })
  RolePermissions: any[];
}

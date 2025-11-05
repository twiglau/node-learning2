import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

interface PermissionType {
  id?: number;
  name: string;
  action: string;
  description?: string;
}

export class CreateRoleDto {
  name: string;
  description?: string;

  @IsOptional()
  @IsArray()
  permissions?: PermissionType[];
}

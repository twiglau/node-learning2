import { CreatePermissionDto } from '@/permission/dto/create-premission.dto';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

interface PermissionType {
  id?: number;
  name: string;
  action: string;
  description?: string;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsArray()
  //隐式类型转换时，转换为 CreatePermissionDto
  @Type(() => CreatePermissionDto)
  permissions?: PermissionType[];
}

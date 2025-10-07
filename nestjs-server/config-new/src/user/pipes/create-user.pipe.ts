import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  /**
   *
   * @param value
   * @param metadata
   * type: 'body' | 'query' | 'param' | 'custom' 参数类型
   * metatype?: Type<unknown>
   * 参数的元类型，例如 String, 如果在函数签名中省略类型声明，或者使用原生JavaScript, 则为undefined.
   * data?:string;
   * 传递给装饰器的字符串，例如 @Body('string').
   * @returns
   */
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    console.log('metadata:', metadata);

    if (value.roles && value.roles instanceof Array && value.roles.length > 0) {
      // Roles[] ->  number[]
      if (value.roles[0]['id'] > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        value.roles = value.roles.map((role) => role.id);
      }
    }
    return value;
  }
}

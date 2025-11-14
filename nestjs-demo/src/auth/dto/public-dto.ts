import { Exclude } from 'class-transformer';
import { SignupDto } from './signup-dto';

// 测试序列化 隐式转换
// enableImplicitConversion: true
// 设置为 true 之后，会对数据按照 设置的类型，进行数据转换
export class TestImplicitConversionDto {}
export class PublicUserDto extends SignupDto {
  // 额外定制某些属性
  @Exclude()
  password: string;

  @Exclude()
  id: string;

  constructor(partial: Partial<PublicUserDto>) {
    // 复用先前 SignupDto 中属性，及判断。
    super();
    Object.assign(this, partial);
  }
}

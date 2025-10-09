import { Body, Controller, Get, Post } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Serialize } from 'src/decorators/serialize.decorator';
class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}

/**
 * 规定返回 暴露的字段
 */
class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
export class LogsController {
  @Get()
  getTest() {
    return 'test';
  }

  @Post()
  @Serialize(PublicLogsDto)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log('logs ~postTest:', dto);
    return dto;
  }
}

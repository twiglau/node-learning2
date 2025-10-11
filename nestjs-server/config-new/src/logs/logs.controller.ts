import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Can, CheckPolices } from 'src/decorators/casl.decorator';
import { Serialize } from 'src/decorators/serialize.decorator';
import { Action } from 'src/enum/action.enum';
import { AdminGuard } from 'src/guards/admin.guard';
import { CaslGuard } from 'src/guards/casl.guard';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Logs } from './logs.entity';
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
@UseGuards(JwtGuard, AdminGuard, CaslGuard)
@CheckPolices((ability) => ability.can(Action.Read, Logs))
@Can(Action.Read, Logs)
export class LogsController {
  @Get()
  @Can(Action.Read, Logs)
  getTest() {
    return 'test';
  }

  @Post()
  @Can(Action.Create, Logs)
  @Serialize(PublicLogsDto)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log('logs ~postTest:', dto);
    return dto;
  }
}

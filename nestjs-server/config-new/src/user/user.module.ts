import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Logs, Roles]),
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport: {
    //       targets: [
    //         {
    //           level: 'info',
    //           target: 'pino-pretty',
    //           options: { colorize: true },
    //         },
    //         {
    //           level: 'info',
    //           target: 'pino-roll',
    //           options: {
    //             file: path.join('logs', 'log.txt'),
    //             frequency: 'daily',
    //             size: '10m',
    //             mkdir: true,
    //           },
    //         },
    //       ],
    //     },
    //     // process.env.NODE_ENV === 'development'
    //     //   ? {
    //     //       // 安装 pino-pretty
    //     //       target: 'pino-pretty',
    //     //       options: { colorize: true },
    //     //     }
    //     //   : {
    //     //       // 安装 pino-roll
    //     //       target: 'pino-roll',
    //     //       options: {
    //     //         file: path.join('logs', 'log.txt'),
    //     //         frequency: 'daily',
    //     //         mkdir: true,
    //     //       },
    //     //     },
    //   },
    // }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

import * as common from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@common.Catch(common.HttpException)
export class HttpExceptionFilter implements common.ExceptionFilter {
  constructor(private logger: common.LoggerService) {}

  catch(exception: common.HttpException, host: common.ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // 记录错误日志
    this.logger.error(exception.message, exception.stack);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      path: request.url,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      method: request.method,
      msg: exception.message || common.HttpException.name,
    });
  }
}

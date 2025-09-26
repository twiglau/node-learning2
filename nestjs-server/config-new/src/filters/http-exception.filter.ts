import * as common from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@common.Catch(common.HttpException)
export class HttpExceptionFilter implements common.ExceptionFilter {
  constructor(private logger: common.LoggerService) {}

  catch(exception: common.HttpException, host: common.ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // 记录错误日志
    this.logger.error(exception.message, exception.stack);

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      msg: exception.message || common.HttpException.name,
    });
  }
}

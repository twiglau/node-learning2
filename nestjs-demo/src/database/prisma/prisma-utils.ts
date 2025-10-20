import { Logger } from '@nestjs/common';
import { catchError, retry, throwError, timer } from 'rxjs';

export const PROTOCOL_REGEX = /^(.*?):\/\//;

export function getDBType(url: string) {
  const matches = url.match(PROTOCOL_REGEX);

  const protocol = matches ? matches[1] : 'file';

  return protocol === 'file' ? 'sqlite' : protocol;
}

export function handleRetry(retryAttempts: number, retryDelay: number) {
  const logger = new Logger('PrismaModule');
  return (source) =>
    source.pipe(
      retry({
        count: retryAttempts,
        delay: (error, retryCount) => {
          if (retryCount <= retryAttempts || retryAttempts === -1) {
            logger.error(
              `Unable to connect to the database, Retrying (${retryCount})...`,
              error.stack,
            );
            return timer(retryDelay);
          } else {
            return throwError(() => new Error('Reached max retries'));
          }
        },
      }),
      catchError((error) => {
        logger.error(
          `Failed to connect to the database after retries ${retryAttempts} times`,
          error.stack || error,
        );
        return throwError(() => error);
      }),
    );
}

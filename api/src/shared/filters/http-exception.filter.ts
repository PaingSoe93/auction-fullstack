import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = exception?.getResponse?.();
    const statusCode =
      errorResponse?.['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR;
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception?.stack);
    }
    const responseErrorMsg = errorResponse?.['message'] || exception.message;
    const message = Array.isArray(responseErrorMsg)
      ? responseErrorMsg
      : [responseErrorMsg];

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.getErrorText(statusCode),
    });
  }

  private getErrorText(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Resource Not Found';
      case 422:
        return 'Unprocessable Entity';
      case 500:
        return 'Internal Server Error';
      case 502:
        return 'Bad Gateway';
      default:
        return '';
    }
  }
}

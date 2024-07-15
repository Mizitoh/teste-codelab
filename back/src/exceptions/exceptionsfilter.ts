import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception instanceof QueryFailedError
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getMessage(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      data: null,
    });
  }
  getMessage(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getResponse();
    }
    if (exception instanceof QueryFailedError) {
      const errorMessage =
        `Erro no banco de dados: ${exception.driverError?.message}` ||
        'Erro no banco de dados';
      const errorDetail = exception.driverError?.detail || '';
      const finalMessage = `${errorMessage}. ${errorDetail}`.replace(
        /[^\w\sÀ-ú\=\(\)\:]/gi,
        '',
      );
      return finalMessage;
    }
    return 'Internal server error';
  }
}

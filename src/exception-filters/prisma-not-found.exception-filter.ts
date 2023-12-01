import { Catch } from '@nestjs/common/decorators';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const { getResponse } = host.switchToHttp();
    const response = getResponse<Response>();

    const messageError = exception.meta?.cause ?? exception.message;
    const statusCode = exception.code === 'P2025' ? 404 : 500;

    console.error(exception);
    response.status(statusCode).json({
      statusCode: statusCode,
      message: messageError,
    });
  }
}

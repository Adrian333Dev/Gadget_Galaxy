import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const message = exception.message || 'Something went wrong';
    console.log({ exception });

    switch (exception.code) {
      case 'P2002':
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message,
        });
      default:
        return super.catch(exception, host);
    }
  }
}

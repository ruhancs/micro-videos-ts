import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityValidationError } from '@rc/micro-videos/@seedwork/domain';
import { Response } from 'express';
import { union } from 'lodash';

//filtror para pegar validacoes do core
@Catch()
export class EntityValidationErrorFilter<T> implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 422;

    response.status(status).json({
      statusCode: status,
      error: 'Unprocessable Entity',
      message: union(...Object.values(exception.error)),
    });
  }
}

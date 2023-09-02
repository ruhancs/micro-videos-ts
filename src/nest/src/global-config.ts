import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WrapperDataInterceptor } from './@share/interceptors/wrapper-data/wrapper-data.interceptor';
import { EntityValidationErrorFilter } from './@share/exception-filters/entity-validation-error/entity-validation-error.filter';
import { NotFoundErrorFilter } from './@share/exception-filters/not-foud-error/not-foud-error.filter';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)), //converter presenter para objeto comum
  );
  //app.useGlobalFilters(new EntityValidationErrorFilter());
  app.useGlobalFilters(new NotFoundErrorFilter());
}

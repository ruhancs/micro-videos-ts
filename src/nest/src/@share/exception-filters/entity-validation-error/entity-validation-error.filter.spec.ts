import { Controller, Get, INestApplication } from '@nestjs/common';
import { EntityValidationErrorFilter } from './entity-validation-error.filter';
import { TestingModule, Test } from '@nestjs/testing';
import { EntityValidationError } from '@rc/micro-videos/@seedwork/domain';
import request from 'supertest';

@Controller('stub')
class StubControler {
  @Get()
  index() {
    throw new EntityValidationError({
      name: ['name is required'],
      description: ['description must be string'],
    });
  }
}

describe('EntityValidationErrorFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubControler],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new EntityValidationErrorFilter());
    await app.init();
  });

  it('should catch EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: ['name is required', 'description must be string'],
      });
  });
});

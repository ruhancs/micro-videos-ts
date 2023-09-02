import { Controller, Get, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { NotFoundError } from '@rc/micro-videos/@seedwork/domain';
import request from 'supertest';
import { NotFoundErrorFilter } from './not-foud-error.filter';

@Controller('stub')
class StubControler {
  @Get()
  index() {
    throw new NotFoundError('test not found error');
  }
}

describe('NotFoundErrorFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubControler],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });

  it('should catch EntityValidationError', () => {
    return request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      error: 'Not Found',
      message: 'test not found error',
    });
  });
});

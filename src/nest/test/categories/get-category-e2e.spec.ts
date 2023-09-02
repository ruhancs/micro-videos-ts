import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Category, CategoryRepository } from '@rc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { applyGlobalConfig } from '../../src/global-config';
//import { getConnectionToken } from '@nestjs/sequelize';

describe('CategoryController GET (e2e)', () => {
  let app: INestApplication;
  let repository: CategoryRepository;
  const category = Category.fake().aCategory().build();
  const categoryId = category.id;

  beforeEach(async () => {
    //instacia do sequelize para apagar dados do db
    //const sequelize = app.get(getConnectionToken());
    //await sequelize.sync({ force: true });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    repository = moduleFixture.get<CategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
    app = moduleFixture.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/categories/:id (GET)', () => {
    it('should return not found', () => {
      request(app.getHttpServer())
        .get(`/categories/77349e57-d8cf-47cf-991e-8f1b62efad1b`)
        .expect(404);
    });

    it('get category', async () => {
      await repository.insert(category);
      const response = await request(app.getHttpServer())
        .get(`/categories/${categoryId}`)
        .expect(200);
      expect(response.body.data.name).toBe(category.name);
      expect(response.body.data.description).toBe(category.description);
    });
  });
});

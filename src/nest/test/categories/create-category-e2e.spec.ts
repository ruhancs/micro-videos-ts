import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoryRepository } from '@rc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixtures } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '../../src/global-config';
import { getConnectionToken } from '@nestjs/sequelize';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let repository: CategoryRepository;

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

  describe('POST /categories', () => {
    it('should throw error with invalid body params', async () => {
      const arrange = CategoryFixtures.invalidRequestData();
      for (const data of arrange) {
        const res = await request(app.getHttpServer())
          .post('/categories')
          .send(data.body)
          .expect(data.expected.statusCode);
        expect(res.body).toMatchObject(data.expected);
      }
    });

    it('create categories', async () => {
      const arrange = CategoryFixtures.arrangeForSave();
      for (const data of arrange) {
        const response = await request(app.getHttpServer())
          .post('/categories')
          .send(data.input)
          .expect(201);

        expect(Object.keys(response.body)).toStrictEqual(['data']);
        const category = await repository.findById(response.body.data.id);
        const presenter = CategoriesController.categoryToResponse(
          category.toJSON(),
        );
        const serialized = instanceToPlain(presenter);
        expect(response.body.data).toStrictEqual(serialized);
        expect(response.body.data.id).toBe(category.id);
        expect(response.body.data.name).toBe(category.name);
        expect(response.body.data.description).toBe(category.description);
        expect(response.body.data.is_active).toBe(category.is_active);
      }
    });
  });
});

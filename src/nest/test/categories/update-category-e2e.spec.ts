import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Category, CategoryRepository } from '@rc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixtures } from '../../src/categories/fixtures';
import { applyGlobalConfig } from '../../src/global-config';
//import { getConnectionToken } from '@nestjs/sequelize';

describe('CategoryController update (e2e)', () => {
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

  describe('PUT /categories/:id', () => {
    it('should throw error with invalid body params to update', async () => {
      const arrange = CategoryFixtures.invalidRequestData();
      for (const data of arrange) {
        const res = await request(app.getHttpServer())
          .put(`/categories/${categoryId}`)
          .send(data.body)
          .expect(data.expected.statusCode);
        expect(res.body).toMatchObject(data.expected);
      }
    });

    it('update categories', async () => {
      const arrange = CategoryFixtures.arrangeForSave();
      await repository.insert(category);
      for (const data of arrange) {
        const response = await request(app.getHttpServer())
          .put(`/categories/${categoryId}`)
          .send(data.input)
          .expect(200);
        const updatedCategory = await repository.findById(categoryId);
        expect(updatedCategory.name).toBe(data.input.name);
        expect(updatedCategory.description).toBe(data.input.description);
        expect(updatedCategory.is_active).toBe(data.input.is_active);
      }
    });
  });
});

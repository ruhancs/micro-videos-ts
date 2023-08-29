import { Test } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CategoriesModule } from '../../categories.module';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListAllCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@rc/micro-videos/category/application';
import { Category, CategoryRepository } from '@rc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../category.providers';
import { CategorySequelize } from '@rc/micro-videos/category/infra';
import {
  NotFoundError,
  SortDirection,
} from '@rc/micro-videos/@seedwork/domain';
import { CategoryCollectionPresenter } from '../../../@share/presenters/collection.presenter';

describe('CategoriesController Integration test', () => {
  let controler: CategoriesController;
  let repository: CategoryRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controler = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should verify if controller is defined', async () => {
    expect(controler).toBeDefined();
    expect(controler['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.CreateCategoryUseCase,
    );
    expect(controler['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UpdateCategoryUseCase,
    );
    expect(controler['listUseCase']).toBeInstanceOf(
      ListAllCategoriesUseCase.ListCategoriesUseCase,
    );
    expect(controler['getUseCase']).toBeInstanceOf(
      GetCategoryUseCase.GetCategoryUseCase,
    );
    expect(controler['removeUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.DeleteCategoryUseCase,
    );
  });

  it('should create a category', async () => {
    const arrange = [
      {
        input: {
          name: 'C1',
          description: null,
          is_active: true,
        },
        output: {
          name: 'C1',
          description: null,
          is_active: true,
        },
      },
      {
        input: {
          name: 'C1',
          description: 'D1',
          is_active: false,
        },
        output: {
          name: 'C1',
          description: 'D1',
          is_active: false,
        },
      },
    ];

    arrange.forEach(async (item) => {
      const presenter = await controler.create({
        name: item.input.name,
        description: item.input.description,
        is_active: item.input.is_active,
      });
      const entity = await repository.findById(presenter.id);

      expect(presenter.id).toBe(entity.id);
      expect(presenter.created_at).toStrictEqual(entity.created_at);
      expect(presenter.name).toBe(item.output.name);
      expect(presenter.description).toBe(item.output.description);
      expect(presenter.is_active).toBe(item.output.is_active);
    });
  });

  it('should update a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const arrange = [
      {
        input: {
          name: 'C1',
          description: null,
          is_active: true,
        },
        output: {
          name: 'C1',
          description: null,
          is_active: true,
        },
      },
      {
        input: {
          name: 'C1',
          description: 'D1',
          is_active: false,
        },
        output: {
          name: 'C1',
          description: 'D1',
          is_active: false,
        },
      },
    ];

    arrange.forEach(async (item) => {
      const presenter = await controler.update(category.id, item.input);
      const entity = await repository.findById(category.id);

      expect(presenter.id).toBe(entity.id);
      expect(presenter.created_at).toStrictEqual(entity.created_at);
      expect(presenter.name).toBe(item.output.name);
      expect(presenter.description).toBe(item.output.description);
      expect(presenter.is_active).toBe(item.output.is_active);
    });
  });

  it('should delete a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create();
    const entity = await repository.findById(category.id);
    expect(entity).toBeDefined();

    await controler.remove(category.id);
    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity not found with this id: ${category.id}`),
    );
  });

  it('should get a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create();
    const presenter = await controler.findOne(category.id);

    expect(presenter).toBeDefined();
    expect(presenter.id).toBe(category.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.description).toBe(category.description);
    expect(presenter.created_at).toStrictEqual(category.created_at);
  });

  describe('Search method tests', () => {
    it('should return CategoryCollection ordered by created_at desc', async () => {
      const categories = Category.fake()
        .theCategories(4)
        .withName((i) => `N-${i}`)
        .withCreatedAt((i) => new Date(new Date().getTime() + i))
        .build();

      await repository.bulkInsert(categories);

      const arrange = [
        {
          send_data: {},
          expected: {
            items: [categories[3], categories[2], categories[1], categories[0]],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
        {
          send_data: { per_page: 2 },
          expected: {
            items: [categories[3], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
        {
          send_data: { per_page: 2, page: 2 },
          expected: {
            items: [categories[1], categories[0]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      ];

      for (const item of arrange) {
        const presenter = await controler.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }
    });

    it('should return output using pagination, sort and filter', async () => {
      const faker = Category.fake().aCategory();
      const categories = [
        faker.withName('b').build(),
        faker.withName('c').build(),
        faker.withName('a').build(),
        faker.withName('Aa').build(),
        faker.withName('AA').build(),
        faker.withName('d').build(),
      ];

      await repository.bulkInsert(categories);

      const arrange = [
        {
          send_data: { page: 1, per_page: 2, sort: 'name', filter: 'a' },
          expected: {
            items: [categories[4], categories[3]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
        {
          send_data: { page: 2, per_page: 2, sort: 'name', filter: 'a' },
          expected: {
            items: [categories[2]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
        {
          send_data: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [categories[2], categories[3]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      ];
      for (const item of arrange) {
        const presenter = await controler.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }
    });
  });
});

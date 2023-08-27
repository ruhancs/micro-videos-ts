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
import { CategoryRepository } from '@rc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../category.providers';
import { CategorySequelize } from '@rc/micro-videos/category/infra';
import { NotFoundError } from '@rc/micro-videos/@seedwork/domain';

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
    const category = await CategorySequelize.CategoryModel.factory().create();
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
      const entity = await repository.findById(presenter.id);

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
});

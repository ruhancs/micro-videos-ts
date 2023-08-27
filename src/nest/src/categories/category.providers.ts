/* eslint-disable @typescript-eslint/no-namespace */
import {
  CreateCategoryUseCase,
  ListAllCategoriesUseCase,
  UpdateCategoryUseCase,
  GetCategoryUseCase,
  DeleteCategoryUseCase,
} from '@rc/micro-videos/category/application';
import { CategoryRepository } from '@rc/micro-videos/category/domain';
import {
  CategoryInMemoryRepository,
  CategorySequelize,
} from '@rc/micro-videos/category/infra';
import { getModelToken } from '@nestjs/sequelize';

export namespace CATEGORY_PROVIDERS {
  export namespace REPOSITORIES {
    export const CATEGORY_IN_MEMORY_REPOSITORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };

    export const CATEGORY_SEQUELIZE_REPOSITORY = {
      provide: 'CategorySequelizeRepository',
      useFactory: (categoryModel: typeof CategorySequelize.CategoryModel) => {
        return new CategorySequelize.CategorySequelizeRepository(categoryModel);
      },
      inject: [getModelToken(CategorySequelize.CategoryModel)],
    };

    //repository default com sequelize
    export const CATEGORY_REPOSITORY = {
      provide: 'CategoryRepository',
      useExisting: 'CategorySequelizeRepository',
    };
  }

  export namespace USECASES {
    export const CREATE_CATEGORY_USE_CASE = {
      provide: CreateCategoryUseCase.CreateCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new CreateCategoryUseCase.CreateCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };
    export const LIST_ALL_CATEGORY_USE_CASE = {
      provide: ListAllCategoriesUseCase.ListCategoriesUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new ListAllCategoriesUseCase.ListCategoriesUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };
    export const UPDATE_CATEGORY_USE_CASE = {
      provide: UpdateCategoryUseCase.UpdateCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new UpdateCategoryUseCase.UpdateCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };
    export const GET_CATEGORY_USE_CASE = {
      provide: GetCategoryUseCase.GetCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new GetCategoryUseCase.GetCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };
    export const DELETE_CATEGORY_USE_CASE = {
      provide: DeleteCategoryUseCase.DeleteCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new DeleteCategoryUseCase.DeleteCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };
  }
}

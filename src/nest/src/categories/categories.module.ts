import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListAllCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@rc/micro-videos/category/application';
import { CategoryInMemoryRepository } from '@rc/micro-videos/category/infra';
import { CategoryRepository } from '@rc/micro-videos/category/domain';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    },
    {
      provide: CreateCategoryUseCase.CreateCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new CreateCategoryUseCase.CreateCategoryUseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: ListAllCategoriesUseCase.ListCategoriesUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new ListAllCategoriesUseCase.ListCategoriesUseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: UpdateCategoryUseCase.UpdateCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new UpdateCategoryUseCase.UpdateCategoryUseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: GetCategoryUseCase.GetCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new GetCategoryUseCase.GetCategoryUseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: DeleteCategoryUseCase.DeleteCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new DeleteCategoryUseCase.DeleteCategoryUseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
  ],
})
export class CategoriesModule {}

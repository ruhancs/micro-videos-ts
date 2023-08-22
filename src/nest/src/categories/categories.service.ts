import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CreateCategoryUseCase,
  ListAllCategoriesUseCase,
} from '@rc/micro-videos/category/application';

@Injectable()
export class CategoriesService {
  @Inject(CreateCategoryUseCase.CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase.CreateCategoryUseCase;

  @Inject(ListAllCategoriesUseCase.ListCategoriesUseCase)
  private listUseCase: ListAllCategoriesUseCase.ListCategoriesUseCase;

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}

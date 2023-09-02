import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  HttpCode,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListAllCategoriesUseCase,
  OutputCatgeoryUseCase,
  UpdateCategoryUseCase,
} from '@rc/micro-videos/category/application';
import { SearchCategoryDto } from './dto/search-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../@share/presenters/collection.presenter';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase.CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase.CreateCategoryUseCase;

  @Inject(ListAllCategoriesUseCase.ListCategoriesUseCase)
  private listUseCase: ListAllCategoriesUseCase.ListCategoriesUseCase;

  @Inject(GetCategoryUseCase.GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase.GetCategoryUseCase;

  @Inject(UpdateCategoryUseCase.UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase.UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase.DeleteCategoryUseCase)
  private removeUseCase: DeleteCategoryUseCase.DeleteCategoryUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return CategoriesController.categoryToResponse(output);
  }

  @Get()
  async search(@Query() searchParams: SearchCategoryDto) {
    const output = await this.listUseCase.execute(searchParams);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id: id });
    return CategoriesController.categoryToResponse(output);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateCategoryDto,
    });
    return;
    CategoriesController.categoryToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.removeUseCase.execute({ id });
  }

  static categoryToResponse(output: OutputCatgeoryUseCase) {
    return new CategoryPresenter(output);
  }
}

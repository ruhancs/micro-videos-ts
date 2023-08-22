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
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListAllCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@rc/micro-videos/category/application';
import { SearchCategoryDto } from './dto/search-category.dto';

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
    return this.createUseCase.execute(createCategoryDto);
  }

  @Get()
  search(@Query() searchParams: SearchCategoryDto) {
    return this.listUseCase.execute(searchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute({ id: id });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.updateUseCase.execute({ id, ...updateCategoryDto });
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeUseCase.execute({ id });
  }
}

import { UpdateCategoryUseCase } from '@rc/micro-videos/category/application';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCategoryDto
  implements Omit<UpdateCategoryUseCase.InputUpdateCategoryUseCase, 'id'>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

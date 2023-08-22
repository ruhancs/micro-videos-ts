import { CreateCategoryUseCase } from '@rc/micro-videos/category/application';

export class CreateCategoryDto
  implements CreateCategoryUseCase.InputCreateCategoryUseCase
{
  name: string;
  description?: string;
  is_active?: boolean;
}

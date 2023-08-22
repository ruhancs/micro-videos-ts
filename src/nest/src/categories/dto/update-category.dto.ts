import { UpdateCategoryUseCase } from '@rc/micro-videos/category/application';

export class UpdateCategoryDto
  implements Omit<UpdateCategoryUseCase.InputUpdateCategoryUseCase, 'id'>
{
  name: string;
  description?: string;
  is_active?: boolean;
}

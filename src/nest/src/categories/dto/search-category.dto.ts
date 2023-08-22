import { ListAllCategoriesUseCase } from '@rc/micro-videos/category/application';
import { SortDirection } from '@rc/micro-videos/dist/@seedwork/domain/repository/repository-contracts';

export class SearchCategoryDto
  implements ListAllCategoriesUseCase.InputListCategoriesUseCase
{
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}

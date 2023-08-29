import { Exclude, Expose, Transform } from 'class-transformer';
import {
  PaginationPresenter,
  PaginationPresenterProps,
} from './pagination.presenter';
import {
  ListAllCategoriesUseCase,
  OutputCatgeoryUseCase,
} from '@rc/micro-videos/category/application';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;

  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: OutputCatgeoryUseCase) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

//serializar paginacao e os items
export abstract class CollectionPresenter {
  @Exclude() //excluir paginationPresente da serializacao
  protected paginationPresenter: PaginationPresenter;

  constructor(props: PaginationPresenterProps) {
    this.paginationPresenter = new PaginationPresenter(props);
  }

  @Expose({ name: 'meta' }) //exposicao dos dados do presenter
  get meta() {
    return this.paginationPresenter;
  }

  abstract get data();
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: ListAllCategoriesUseCase.OutputListCategoriesUseCase) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new CategoryPresenter(item));
  }
}

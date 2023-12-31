import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import {
  CreateCategoryUseCase,
  ListAllCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@rc/micro-videos/category/application';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { SearchInputDto } from '@rc/micro-videos/dist/@seedwork/application/dto/search-input';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../../../@share/presenters/collection.presenter';

describe('CategoriesController unit test', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create category', async () => {
    const created_at = new Date();
    const output: CreateCategoryUseCase.OutputCreateCategoryUseCase = {
      id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
      name: 'N1',
      description: 'D1',
      is_active: true,
      created_at: created_at,
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(output),
    };

    controller['createUseCase'] = mockCreateUseCase as any;
    const createInput: CreateCategoryDto = {
      name: 'N1',
      description: 'D1',
      is_active: true,
    };
    const presenter = await controller.create(createInput);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(createInput);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should update category', async () => {
    const created_at = new Date();
    const id = '77349e57-d8cf-47cf-991e-8f1b62efad1b';
    const expectedOutput: UpdateCategoryUseCase.OutputUpdateCategoryUseCase = {
      id: id,
      name: 'N1',
      description: 'D1',
      is_active: true,
      created_at: created_at,
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    };

    controller['updateUseCase'] = mockCreateUseCase as any;
    const input: UpdateCategoryDto = {
      name: 'N1',
      description: 'D1',
      is_active: true,
    };
    const output = await controller.update(id, input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
  });

  it('should delete category', async () => {
    const id = '77349e57-d8cf-47cf-991e-8f1b62efad1b';
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    controller['removeUseCase'] = mockDeleteUseCase as any;
    const output = await controller.remove(id);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should get category', async () => {
    const created_at = new Date();
    const id = '77349e57-d8cf-47cf-991e-8f1b62efad1b';
    const Output: UpdateCategoryUseCase.OutputUpdateCategoryUseCase = {
      id: id,
      name: 'N1',
      description: 'D1',
      is_active: true,
      created_at: created_at,
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Output),
    };

    controller['getUseCase'] = mockGetUseCase as any;

    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toMatchObject(new CategoryPresenter(Output));
  });

  it('should searc category', async () => {
    const created_at = new Date();
    const id = '77349e57-d8cf-47cf-991e-8f1b62efad1b';
    const expectedOutput: ListAllCategoriesUseCase.OutputListCategoriesUseCase =
      {
        items: [
          {
            id: id,
            name: 'N1',
            description: 'D1',
            is_active: true,
            created_at: created_at,
          },
        ],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 1,
      };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    };

    controller['listUseCase'] = mockGetUseCase as any;

    const input: SearchInputDto = {
      page: 1,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'N1',
    };
    const presenter = await controller.search(input);

    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith(input);
    expect(new CategoryCollectionPresenter(expectedOutput)).toEqual(presenter);
  });
});

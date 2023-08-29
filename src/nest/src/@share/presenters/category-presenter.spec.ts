import { instanceToPlain } from 'class-transformer';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
  CollectionPresenter,
} from './collection.presenter';
import { PaginationPresenter } from './pagination.presenter';

describe('CategoryPresenter unit test', () => {
  it('should createa presenter', () => {
    const created_at = new Date();
    const presenter = new CategoryPresenter({
      id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
      name: 'C1',
      description: 'D1',
      is_active: true,
      created_at,
    });

    expect(presenter.id).toBe('77349e57-d8cf-47cf-991e-8f1b62efad1b');
    expect(presenter.name).toBe('C1');
    expect(presenter.description).toBe('D1');
    expect(presenter.is_active).toBeTruthy();
    expect(presenter.created_at).toBe(created_at);
  });

  it('should formate data', () => {
    const created_at = new Date();
    const presenter = new CategoryPresenter({
      id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
      name: 'C1',
      description: 'D1',
      is_active: true,
      created_at,
    });

    const data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
      name: 'C1',
      description: 'D1',
      is_active: true,
      created_at: created_at.toISOString(),
    });
  });
});

describe('PaginationPresenter unit test', () => {
  it('should set values on PaginationPresenter', () => {
    const presenter = new PaginationPresenter({
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(presenter.current_page).toBe(1);
    expect(presenter.last_page).toBe(3);
    expect(presenter.total).toBe(4);
    expect(presenter.per_page).toBe(2);
  });

  it('should set values string on PaginationPresenter', () => {
    const presenter = new PaginationPresenter({
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    });

    expect(presenter.current_page).toBe('1');
    expect(presenter.last_page).toBe('3');
    expect(presenter.total).toBe('4');
    expect(presenter.per_page).toBe('2');
  });
});

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3, 4];
}

describe('CollectionPresenter unit test', () => {
  it('should set values on CollectionPresenter', () => {
    const presenter = new StubCollectionPresenter({
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(presenter['paginationPresenter']).toBeInstanceOf(
      PaginationPresenter,
    );
    expect(presenter['paginationPresenter'].current_page).toBe(1);
    expect(presenter['paginationPresenter'].last_page).toBe(3);
    expect(presenter['paginationPresenter'].total).toBe(4);
    expect(presenter['paginationPresenter'].per_page).toBe(2);
    expect(presenter.meta).toStrictEqual(presenter['paginationPresenter']);
    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [1, 2, 3, 4],
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
    });
  });
});

describe('CatgeoryCollectionPresenter unit test', () => {
  it('should set values on CollectionPresenter', () => {
    const created_at = new Date();
    const presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
          name: 'C1',
          description: 'D1',
          is_active: true,
          created_at,
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
    expect(presenter.meta).toStrictEqual(
      new PaginationPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      }),
    );
    expect(presenter.data).toStrictEqual([
      new CategoryPresenter({
        id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
        name: 'C1',
        description: 'D1',
        is_active: true,
        created_at,
      }),
    ]);
  });
});

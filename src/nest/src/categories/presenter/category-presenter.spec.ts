import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from './category.presenter';

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

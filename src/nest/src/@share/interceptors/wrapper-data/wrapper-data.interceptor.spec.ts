import { of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });
  it('should wrapper with data key', (done) => {
    expect(interceptor).toBeDefined();
    const observable = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });

    observable
      .subscribe({
        next: (value) => {
          expect(value).toEqual({ data: { name: 'test' } });
        },
      })
      .add(() => done());
  });

  it('should not wrapper when meta key does not exist', (done) => {
    expect(interceptor).toBeDefined();
    const observable = interceptor.intercept({} as any, {
      handle: () => of({ data: [{ name: 'test' }], meta: { total: 1 } }),
    });

    observable
      .subscribe({
        next: (value) => {
          expect(value).toStrictEqual({
            data: [{ name: 'test' }],
            meta: { total: 1 },
          });
        },
      })
      .add(() => done());
  });
});

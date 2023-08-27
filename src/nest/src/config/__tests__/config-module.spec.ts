import Joi from 'joi';
import { CONFIG_DB_SCHEMA, ConfigModule } from '../config.module';
import { Test } from '@nestjs/testing';
import { join } from 'path';

function expectValidade(schema: Joi.Schema, value: any) {
  return expect(schema.validate(value, { abortEarly: false }).error.message);
}

describe('Schema unit tests', () => {
  describe('DB schema', () => {
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });

    describe('DB_VENDOR', () => {
      it('should test invalid cases required', () => {
        expectValidade(schema, {}).toContain('"DB_VENDOR" is required');
      });

      it('should test invalid cases type mysql | sqlite', () => {
        expectValidade(schema, { DB_VENDOR: 'postgress' }).toContain(
          '"DB_VENDOR" must be one of [mysql, sqlite]',
        );
      });

      it('should test valid case', () => {
        const arrange = ['mysql', 'sqlite'];
        arrange.forEach((value) => {
          expectValidade(schema, { DB_VENDOR: value }).not.toContain(
            '"DB_VENDOR" must be one of [mysql, sqlite]',
          );
        });
      });
    });

    describe('DB_HOST', () => {
      it('should test invalid case requerid', () => {
        expectValidade(schema, {}).toContain('"DB_HOST" is required');
      });

      it('should test invalid type', () => {
        expectValidade(schema, { DB_HOST: 1 }).toContain(
          '"DB_HOST" must be a string',
        );
      });

      it('should test valid case', () => {
        expectValidade(schema, { DB_HOST: 'memory' }).not.toContain(
          '"DB_HOST" must be a string',
        );
      });
    });

    describe('DB_DATABASE', () => {
      it('should test invalid case requerid', () => {
        expectValidade(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_DATABASE" is required',
        );
      });

      it('should test invalid type', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_DATABASE: 1,
        }).toContain('"DB_DATABASE" must be a string');
      });

      it('should test valid case', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_DATABASE: 'localhost',
        }).not.toContain('"DB_DATABASE" must be a string');
      });
    });

    describe('DB_USERNAME', () => {
      it('should test invalid case requerid', () => {
        expectValidade(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_USERNAME" is required',
        );
      });

      it('should test invalid type', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_USERNAME: 1,
        }).toContain('"DB_USERNAME" must be a string');
      });

      it('should test valid case', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_USERNAME: 'root',
        }).not.toContain('"DB_USERNAME" must be a string');
      });
    });

    describe('DB_PASSWORD', () => {
      it('should test invalid case requerid', () => {
        expectValidade(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_PASSWORD" is required',
        );
      });

      it('should test invalid type', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_PASSWORD: 1,
        }).toContain('"DB_PASSWORD" must be a string');
      });

      it('should test valid case', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_PASSWORD: '123',
        }).not.toContain('"DB_PASSWORD" must be a string');
      });
    });

    describe('DB_PORT', () => {
      it('should test invalid case requerid', () => {
        expectValidade(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_PORT" is required',
        );
      });

      it('should test invalid type', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_PORT: 'fwqdf',
        }).toContain('"DB_PORT" must be a number');
      });

      it('should test valid case', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_PASSWORD: '123',
        }).not.toContain('"DB_PORT" must be a number');
      });
    });

    describe('DB_LOGGING', () => {
      it('should test invalid case requerid', () => {
        expectValidade(schema, { DB_VENDOR: 'sqlite' }).toContain(
          '"DB_LOGGING" is required',
        );
      });

      it('should test invalid type', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_LOGGING: 'fwqdf',
        }).toContain('"DB_LOGGING" must be a boolean');
      });

      it('should test valid case', () => {
        expectValidade(schema, {
          DB_VENDOR: 'mysql',
          DB_LOGGING: true,
        }).not.toContain('"DB_LOGGING" must be a boolean');
      });
    });
  });
});

describe('ConfigModule Tests', () => {
  it('should throw an error when env var is invalid', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, '.env-mock'),
          }),
        ],
      });
      fail('ConfigModule should throw an error');
    } catch (error) {
      expect(error.message).toContain(
        '"DB_VENDOR" must be one of [mysql, sqlite]',
      );
    }
  });

  it('should be valid ConfigModule', () => {
    const module = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    });
    expect(module).toBeDefined();
  });
});

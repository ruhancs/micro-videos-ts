import { Test } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { CONFIG_DB_SCHEMA, ConfigModule } from '../config/config.module';
import { getConnectionToken } from '@nestjs/sequelize';
import Joi from 'joi';

describe('DatabaseModule tests', () => {
  it('should be database module with sqlite connection', async () => {
    const connOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });
    const { error } = schema.validate(connOptions, {});
    expect(error).toBeUndefined();

    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          validationSchema: null,
          load: [() => connOptions],
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    const conn = app.get(getConnectionToken());

    expect(conn).toBeDefined();
    expect(conn.options.dialect).toBe('sqlite');
    expect(conn.options.host).toBe(':memory:');
    await conn.close();
  });

  it('should be database module with mysql connection', async () => {
    const connOptions = {
      DB_VENDOR: 'mysql',
      DB_HOST: 'localhost',
      DB_DATABASE: 'test',
      DB_USERNAME: 'root',
      DB_PASSWORD: 'root',
      DB_PORT: 3306,
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });
    const { error } = schema.validate(connOptions, {});
    expect(error).toBeUndefined();

    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          validationSchema: null,
          load: [() => connOptions],
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    const conn = app.get(getConnectionToken());

    expect(conn).toBeDefined();
    expect(conn.options.dialect).toBe('mysql');
    expect(conn.options.host).toBe('localhost');
    await conn.close();
  });
});

import { getConnectionToken } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { migrator } from '@rc/micro-videos/@seedwork/infra';
import { MigrationModule } from '../src/database/migration/migration.module.ts.module';
import { Umzug } from 'umzug';

describe('Migrate e2e', () => {
  let umzug: Umzug;
  const totalMigrations = 1;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MigrationModule],
    }).compile();

    const sequelize = moduleFixture.get(getConnectionToken());
    umzug = migrator(sequelize, { logger: undefined });
  });

  test('up command', async () => {
    await umzug.down({ to: 0 as any }); //desfaz tudo do db
    const result = await umzug.up();
    expect(result).toHaveLength(totalMigrations);
  });
});

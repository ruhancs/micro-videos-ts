import { INestApplication } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
//import { getConnectionToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { applyGlobalConfig } from '../../global-config';
//import { migrator } from '@rc/micro-videos/@seedwork/infra';
//import { Sequelize } from 'sequelize';

export function startApp({
  beforeInit,
}: { beforeInit?: (app: INestApplication) => void } = {}) {
  let _app: INestApplication;
  //let canRunMigrations: boolean;

  beforeEach(async () => {
    const moduleBuilder: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    _app = moduleBuilder.createNestApplication();
    applyGlobalConfig(_app);
    beforeInit && beforeInit(_app);
    await _app.init();
  });
  //

  afterEach(async () => {
    if (_app) {
      await _app.close();
    }
  });

  return {
    get app() {
      return _app;
    },
  };
}

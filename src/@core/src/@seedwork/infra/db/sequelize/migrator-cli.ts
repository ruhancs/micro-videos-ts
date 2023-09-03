import { Sequelize } from "sequelize-typescript";
import { migrator } from "./migrator";

//gerar arquivo para criar tabelas
////node_modules/.bin/ts-node src/@core/src/@seedwork/infra/db/sequelize/migrator.ts create --name create-categories-table.ts --folder .

//migracao
//node_modules/.bin/ts-node src/@core/src/@seedwork/infra/db/sequelize/migrator-cli.ts up

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: true
})

migrator(sequelize).runAsCLI()
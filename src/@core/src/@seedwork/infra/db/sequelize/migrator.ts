import { join } from "path";
import { Sequelize } from "sequelize-typescript";
import { SequelizeStorage, Umzug, UmzugOptions } from "umzug";

//node_modules/.bin/ts-node src/@core/src/@seedwork/infra/db/sequelize/migrator.ts create --name create-categories-table.ts --folder .

const sequelize = new Sequelize({
    dialect: 'sqlite',
    host: ':memory:',
    logging: true,
})

export const migrator = (sequelize: Sequelize, options?: Partial<UmzugOptions>) => new Umzug({
    migrations: {
        glob: [
            "*/infra/db/sequelize/migrations/*.{js,ts}",
             //diretorio que ira iniciar a procura
            {
                cwd: join(__dirname, "../../../../"), 
                ignore:["**/*.d.ts", "**/idex.ts", "**/index.js"],
            },
        ],
    },
    context: sequelize,
    storage: new SequelizeStorage({sequelize}),
    logger: console,
    ...(options || {}),
})
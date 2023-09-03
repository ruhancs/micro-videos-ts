import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import type { MigrationFn } from 'umzug';

//comando migracao
//node_modules/.bin/ts-node src/@core/src/@seedwork/infra/db/sequelize/migrator.ts create --name create-categories-table.ts --folder .

//migracao
//node_modules/.bin/ts-node src/@core/src/@seedwork/infra/db/sequelize/migrator.ts up

export const up: MigrationFn<Sequelize> = async ({context: sequelize}) => {
    await sequelize.getQueryInterface().createTable('categories', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE(3), // 3 para nao trabalhar com  segundos fracionais
            allowNull: false
        },
    })
};
export const down: MigrationFn<Sequelize> = async({context: sequelize}) => {
    await sequelize.getQueryInterface().dropTable('categories')
};

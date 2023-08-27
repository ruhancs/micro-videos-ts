import { makeEnvConfigTest as config } from "#seedwork/infra/config"
import { Sequelize, SequelizeOptions } from "sequelize-typescript"

const sequelizeOptions: SequelizeOptions = {
    dialect: config.db.vendor,
    host: config.db.host,
    logging: config.db.logging,
}

export function setupSequelize(options: SequelizeOptions) {
    let _sequelize: Sequelize

    beforeAll(() => _sequelize = new Sequelize({
        ...sequelizeOptions,
        ...options,
    }))

    //zerar o db antes de cada test
    beforeEach(async() => {
        await _sequelize.sync({force: true})
    })

    return  {
        get sequelize() {
            return _sequelize
        }
    }
}
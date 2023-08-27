import {config as readEnv} from 'dotenv'
import { join } from 'path'

const pathEnvFile = join(__dirname, '../../../../.env.test')
readEnv({path: pathEnvFile})

export const config = {
    db: {
        vendor: process.env.DB_VENDOR as any,
        host: process.env.DB_HOST,
        logging: process.env.DB_LOGGING === 'true',
    }
}

function makeConfig(pathEnvFile) {
    
    const out = readEnv({path: pathEnvFile})

    return {
        db: {
            vendor: out.parsed.DB_VENDOR as any,
            host: out.parsed.DB_HOST,
            logging: out.parsed.DB_LOGGING === 'true',
        }
    }
}

export const makeEnvConfigTest = makeConfig(pathEnvFile)
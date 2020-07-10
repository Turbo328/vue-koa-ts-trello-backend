import databaseConfig from './database.json';
import path from 'path';

interface IDatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb';
    timezone: string;
}

const configs = {
    development: {
        server: {
            host: 'localhost',
            port: 8000
        },
        database: databaseConfig.development as IDatabaseConfig,
        jwt: {
            privateKey: 'trello-app'
        },
        storage: {
            dir: path.resolve(__dirname, '../attachments'),
            prefix: '/public/attachments'
        }
    },
    production: {
        server: {
            host: 'localhost',
            port: 8000
        },
        database: databaseConfig.production as IDatabaseConfig,
        jwt: {
            privateKey: 'trello-app'
        },
        storage: {
            dir: path.resolve(__dirname, '../attachments'),
            prefix: '/public/attachments'
        }
    },
    test: {
        server: {
            host: 'localhost',
            port: 8000
        },
        database: databaseConfig.test as IDatabaseConfig,
        jwt: {
            privateKey: 'trello-app'
        },
        storage: {
            dir: path.resolve(__dirname, '../attachments'),
            prefix: '/public/attachments'
        }
    }
}

// 环境变量类型
// 添加新的 config 会自动更新
type configKeys = keyof typeof configs;

// 确定环境变量范围
const NODE_ENV = process.env.NODE_ENV as configKeys || 'development';

export default configs[NODE_ENV];
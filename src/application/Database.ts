import {Sequelize} from "@sequelize/core";
import {PostgresDialect} from "@sequelize/postgres";
import {Account} from "../model/Account";
import {AccountRole} from "../model/AccountRole";
import {Role} from "../model/Role";
import {getAlwaysOnLogger} from "../util/logger";
import {Logger} from "log4js";

type THostConfig = {host: string, port?: number}
type TLog = false | ((sql: string, timing?: number) => void)

const logger: Logger = getAlwaysOnLogger("Database")

let instance: Sequelize | null = null

export const SequelizeHolder = {
    set(sequelize: Sequelize): void {
        instance = sequelize
    },
    get(): Sequelize {
        if (instance == null) {
            throw new Error("Sequelize instance not initialized. Ensure Database.start() has been called before any transaction.")
        }

        return instance
    }
}


export class Database {
    private readonly sequelize: Sequelize

    constructor(isProd: boolean) {
        this.sequelize = new Sequelize({
            dialect: PostgresDialect,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ...this.getHostConfiguration(isProd),
            clientMinMessages: "notice",
            logging: this.setLog(),
            benchmark: true,
            models: [
                Account,
                AccountRole,
                Role
            ]
        })
    }

    async start(): Promise<void> {
        try {
            await this.sequelize.authenticate()
            SequelizeHolder.set(this.sequelize)
            logger.debug("Connection has been established successfully");
        } catch (error) {
            const message = "Unable to connect to the database"
            logger.error(message, error);
            throw new Error(message)
        }
    }

    private getHostConfiguration(isProd: boolean): THostConfig {
        if(isProd) {
            logger.debug("Using Unix socket for database connection")

            return {
                host: `/cloudsql/${process.env.INSTANCE_UNIX_SOCKET}`
            }
        }

        logger.warn("Using TCP protocol for Database connection")

        return {
            host: process.env.DB_HOST!,
            port: Number(process.env.DB_PORT)
        }
    }

    private setLog(): TLog {
        if(process.env.LOGS_ENABLED === "true") {
            logger.warn("Database logs enabled")
            return (query: string, timing?: number): void => logger.debug(`${timing ? `${JSON.stringify(timing)}ms - ` : ""}${query}`)
        }

        return false
    }
}
import dotenv from "dotenv";
import {Logger} from "log4js";
import {getAlwaysOnLogger} from "../util/logger";

const logger: Logger = getAlwaysOnLogger("environment")

enum EnvironmentType {
    PROD = "prod",
    CUSTOM = "custom"
}

export function instanceEnv(): boolean {
    const env: string | undefined = process.env.NODE_ENV
    const quiet = {quiet: true}

    if(env !== undefined) {
        if(!Object.entries(EnvironmentType).map(([_key, value]: [string, string]): string => value).includes(env)) {
            throw new Error(`Unknown environment: ${env}`)
        }

        const envFile = `.env.${env}`
        logger.debug(`App started in ${env.toUpperCase()} mode. Configuring env variables using ${envFile} file`)
        dotenv.config({...quiet, path: envFile})
        return env === EnvironmentType.PROD
    }

    logger.info(`App started in DEV mode. Configuring env variables using .env file`)
    dotenv.config(quiet)
    return false
}
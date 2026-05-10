import {Server} from "./application/Server";
import {Database} from "./application/Database";
import {instanceEnv} from "./application/environment";
import {getAlwaysOnLogger} from "./util/logger";
import {Logger} from "log4js";

const logger: Logger = getAlwaysOnLogger("Main")

async function main(): Promise<void> {
    logger.info("Starting application")
    const isProd: boolean = instanceEnv();
    const database = new Database(isProd)
    await database.start()

    const server = new Server(3000)
    server.start()
    logger.info("Application started successfully")
}

main().catch((error: any) => logger.error("Application start failed", error))
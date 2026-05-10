import express, {Router} from "express";
import {FastifyInstance} from "fastify";
import {BaseServerRoute} from "../route/BaseServerRoute";
import {AccountRoute} from "../route/AccountRoute";
import {errorHandler} from "../handler/errorHandler";
import {Logger} from "log4js";
import {getAlwaysOnLogger} from "../util/logger";

type ExpressFastifyInstance = FastifyInstance & {
    use: (...handlers: unknown[]) => unknown
}

const logger: Logger = getAlwaysOnLogger("Server")

export class Server {
    private readonly port: number
    private readonly fastify: ExpressFastifyInstance = require("fastify")()
    
    constructor(port: number) {
        this.port = port
    }

    start(): void {
        this.registerPlugins()

        this.fastify.listen({port: this.port, host: "0.0.0.0"}, (error: Error | null, address: string): void => {
            if(error) {
                const message = `Server failed to started on port ${this.port}`
                logger.error(message)
                throw new Error(message)
            }

            logger.info(`Server listening at ${address}`)
        })
    }

    private registerPlugins(): void {
        logger.debug("Registering plugins")

        this.fastify.register(require("@fastify/express"))
            .after((): void => {
                this.fastify.use(require("cors")())
                this.fastify.use(express.urlencoded({extended: false})) // for Postman x-www-form-urlencoded
                this.fastify.use(express.json())
                this.fastify.use(this.registerRoutes())
                this.fastify.use(errorHandler)
            })
    }

    private registerRoutes(): Router {
        logger.debug("Registering routes")
        const router: Router = express.Router()

        new BaseServerRoute().registerRoutes(router)
        new AccountRoute().registerRoutes(router)
        logger.debug("All routes registered successfully")

        return router
    }
}
import {Request, Response} from "express";
import {ValidatorError} from "../exception/ValidatorError";
import {Logger} from "log4js";
import {getLogger} from "../util/logger";
import {EntityNotFoundException} from "../exception/EntityNotFoundException";

const logger: Logger = getLogger("errorHandler")

export function errorHandler(error: any, _req: Request, res: Response): void {
    let message: string
    let statusCode: number

    switch(true) {
        case error instanceof ValidatorError:
            message = `Validation failed: ${error.message}`
            statusCode = 400
            break
        case error instanceof EntityNotFoundException:
            message = `Entity not found: ${error.message}`
            statusCode = 404
            break
        default:
            message = error.message
            statusCode = 500
    }

    logger.error(`Error during [${error.method}] ${error.url}. Returning status code ${statusCode}`)

    res.status(statusCode)
        .json(message)
        .end()
}
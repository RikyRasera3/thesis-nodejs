import {Request, Response} from "express";
import {Logger} from "log4js";
import {getLogger} from "../util/logger";
import {GetTestResultsRequestType, GetTestResultsResponseType} from "../dto/GetTestResultsDto";
import path from "path";

const logger: Logger = getLogger("BaseServerController")

export class BaseServerController {
    async getServerStatus(_req: Request, res: Response): Promise<void> {
        logger.info("Received request for server status")

        res.json({status: "OK", message: "Server is running"})
            .end()
    }

    async ping(_req: Request, res: Response): Promise<void> {
        logger.info("Received ping request")

        res.json({message: "pong"})
            .end()
    }

    async getTestResults(req: GetTestResultsRequestType, res: GetTestResultsResponseType): Promise<void> {
        logger.info(`Getting ${req.validatedParams!.file} test file content`)
        const filename = `${req.validatedParams!.file}-scenario.json`
        const filePath = path.resolve(__dirname, `../../grafana/results/${filename}`)

        try {
            res.download(filePath, `nodejs-${req.validatedParams!.file}-scenario.json`)
        } catch(error: unknown) {
            logger.error(`Error reading file ${filePath}`, error)
            throw new Error(`Error reading file: ${filePath}`)
        }
    }
}
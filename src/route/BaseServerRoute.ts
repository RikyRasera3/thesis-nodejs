import {BaseServerController} from "../controller/BaseServerController";
import {Router} from "express";
import {SERVER_PATH} from "./Path";
import {paramValidatorHandler} from "../handler/validatorHandler";
import {GetTestResultsParam} from "../dto/GetTestResultsDto";

export class BaseServerRoute {
    registerRoutes(router: Router): void {
        const controller = new BaseServerController()

        router.get(SERVER_PATH, controller.getServerStatus)

        router.get(`${SERVER_PATH}/ping`, controller.ping)

        router.get(
            `${SERVER_PATH}/test-results/:file`,
            paramValidatorHandler(GetTestResultsParam),
            controller.getTestResults
        )
    }
}
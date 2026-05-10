import {AccountController} from "../controller/AccountController";
import {Router} from "express";
import {
    bodyValidatorHandler,
    paramValidatorHandler,
    queryParamValidatorHandler
} from "../handler/validatorHandler";
import {GetAccountsCriteria} from "../dto/GetAccountsDto";
import {GetAccountByIdParam} from "../dto/GetAccountByIdDto";
import {UpdateAccountDto, UpdateAccountParam} from "../dto/UpdateAccountDto";
import {DeleteAccountParam} from "../dto/DeleteAccountDto";
import {CreateAccountDto} from "../dto/CreateAccountDto";
import {SearchAccountsCriteria} from "../dto/SearchAccountsDto";
import {ACCOUNT_PATH} from "./Path";

export class AccountRoute {
    registerRoutes(router: Router): void {
        const controller = new AccountController()

        router.get(
            `${ACCOUNT_PATH}/search`,
            queryParamValidatorHandler(SearchAccountsCriteria, ["roleIds", "page", "size"]),
            controller.searchAccountsPaged
        )

        router.get(ACCOUNT_PATH, queryParamValidatorHandler(GetAccountsCriteria, ["roleIds"]), controller.getAccounts)

        router.get(`${ACCOUNT_PATH}/:id`, paramValidatorHandler(GetAccountByIdParam, ["id"]), controller.getAccountById)

        router.post(ACCOUNT_PATH, bodyValidatorHandler(CreateAccountDto), controller.createAccount)

        router.patch(
            `${ACCOUNT_PATH}/:id`,
            paramValidatorHandler(UpdateAccountParam, ["id"]),
            bodyValidatorHandler(UpdateAccountDto),
            controller.updateAccount
        )

        router.delete(`${ACCOUNT_PATH}/:id`, paramValidatorHandler(DeleteAccountParam, ["id"]), controller.deleteAccount)
    }
}
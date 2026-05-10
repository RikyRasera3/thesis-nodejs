import {AccountService} from "../service/AccountService";
import {Account} from "../model/Account";
import {GetAccountsRequestType, GetAccountsResponseType} from "../dto/GetAccountsDto";
import {GetAccountByIdRequestType, GetAccountByIdResponseType} from "../dto/GetAccountByIdDto";
import {CreateAccountRequestType, CreateAccountResponseType} from "../dto/CreateAccountDto";
import {
    UpdateAccountRequestType,
    UpdateAccountResponseType
} from "../dto/UpdateAccountDto";
import {DeleteAccountRequestType, DeleteAccountResponseType} from "../dto/DeleteAccountDto";
import {SearchAccountsRequestType, SearchAccountsResponseType} from "../dto/SearchAccountsDto";
import {IPagedResponse} from "../util/types";
import {ACCOUNT_PATH} from "../route/Path";
import {Logger} from "log4js";
import {getLogger} from "../util/logger";

const logger: Logger = getLogger("AccountController")

const accountService = new AccountService()

export class AccountController {
    async searchAccountsPaged(req: SearchAccountsRequestType, res: SearchAccountsResponseType): Promise<void> {
        logger.info("Received request to search accounts with pagination")
        const totalElements: number = await accountService.countAll(req.validatedQuery!)

        const response: IPagedResponse<Account> = {
            content: await accountService.findAllPaged(req.validatedQuery!),
            page: {
                size: req.validatedQuery!.size,
                number: req.validatedQuery!.page,
                totalElements,
                totalPages: Math.ceil(totalElements / req.validatedQuery!.size)
            }
        }

        res.status(200)
            .json(response)
            .end()
    }

    async getAccounts(req: GetAccountsRequestType, res: GetAccountsResponseType): Promise<void> {
        logger.info("Received request to search accounts")
        const accounts: Account[] = await accountService.findAll(req.validatedQuery!)

        res.status(200)
            .json(accounts)
            .end()
    }

    async getAccountById(req: GetAccountByIdRequestType, res: GetAccountByIdResponseType): Promise<void> {
        logger.info(`Received request to search account with id ${req.validatedParams!.id}`)
        const account: Account | null = await accountService.findById(req.validatedParams!.id)

        res.status(200)
            .json(account)
            .end()
    }

    async createAccount(req: CreateAccountRequestType, res: CreateAccountResponseType): Promise<void> {
        logger.info("Received request to create account")
        const account: Account = await accountService.createAccount(req.body)

        res.status(201)
            .location(`${req.protocol}://${req.get("host")}${ACCOUNT_PATH}/${account.id}`)
            .json(account)
            .end()
    }

    async updateAccount(req: UpdateAccountRequestType, res: UpdateAccountResponseType): Promise<void> {
        logger.info(`Received request to update account with id ${req.validatedParams!.id}`)
        await accountService.updateAccount(req.validatedParams!.id, req.body)

        res.status(200)
            .json()
            .end()
    }

    async deleteAccount(req: DeleteAccountRequestType, res: DeleteAccountResponseType): Promise<void> {
        logger.info(`Received request to delete account with id ${req.validatedParams!.id}`)
        await accountService.deleteAccount(req.validatedParams!.id)

        res.status(204)
            .json()
            .end()
    }
}
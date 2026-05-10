import {Account, IAccountSample} from "../model/Account";
import {GetAccountsCriteria} from "../dto/GetAccountsDto";
import {Role} from "../model/Role";
import {AccountRole} from "../model/AccountRole";
import {CreateAccountDto} from "../dto/CreateAccountDto";
import {UpdateAccountDto} from "../dto/UpdateAccountDto";
import {SearchAccountsCriteria} from "../dto/SearchAccountsDto";
import {FindOptions} from "@sequelize/core";
import {EntityNotFoundException} from "../exception/EntityNotFoundException";
import {AccountRoleService} from "./AccountRoleService";
import {RoleService} from "./RoleService";
import {Transactional} from "../decorator/Transactional";
import {AccountRoleFactory} from "../factory/AccountRoleFactory";

function updateValues(account: Account, dto: UpdateAccountDto): Account {
    if(dto.name) {
        account.name = dto.name
    }

    if(dto.surname) {
        account.surname = dto.surname
    }

    if(dto.email) {
        account.email = dto.email
    }

    if(dto.phone) {
        account.phone = dto.phone
    }

    if(dto.dateOfBirth) {
        account.dateOfBirth = dto.dateOfBirth
    }

    return account
}

const accountRoleService = new AccountRoleService()
const roleService = new RoleService()

export class AccountService {
    @Transactional()
    async createAccount(dto: CreateAccountDto): Promise<Account> {
        await roleService.findAllByRoleIds(dto.roleIds)
        const account: Account = await Account.create(dto)
        await accountRoleService.create(AccountRoleFactory.createAccountRoles(account.id, dto.roleIds))
        return account
    }

    @Transactional()
    async updateAccount(id: number, dto: UpdateAccountDto): Promise<void> {
        const account: Account = await this.findByIdOrError(id)

        if(dto.roleIds !== undefined) {
            await roleService.findAllByRoleIds(dto.roleIds)
            await accountRoleService.deleteByAccountId(id)
            await accountRoleService.create(AccountRoleFactory.createAccountRoles(id, dto.roleIds))
        }

        await Account.update(updateValues(account, dto), {where: {id: account.id}})
    }

    @Transactional()
    async deleteAccount(id: number) {
        await this.findByIdOrError(id)
        await accountRoleService.deleteByAccountId(id)
        await Account.destroy({where: {id}})
    }

    async countAll(criteria: GetAccountsCriteria): Promise<number> {
        if(criteria?.roleIds !== undefined) {
            return Account.count({
                distinct: true,
                include: [{
                    model: AccountRole,
                    where: {
                        roleId: criteria.roleIds
                    }
                }]
            })
        }

        return Account.count()
    }

    async findAllPaged(criteria: SearchAccountsCriteria): Promise<Account[]> {
        const options: FindOptions<IAccountSample> = {
            limit: criteria.size,
            offset: criteria.size * criteria.page,
        }

        if(criteria?.roleIds !== undefined) {
            return Account.findAll({
                ...options,
                include: [{
                    model: AccountRole,
                    include: [Role],
                    where: {
                        roleId: criteria.roleIds
                    }
                }]
            })
        }

        return Account.findAll({
            ...options,
            include: [{
                model: AccountRole,
                include: [Role]
            }]
        })
    }

    async findAll(criteria: GetAccountsCriteria): Promise<Account[]> {
        if(criteria?.roleIds !== undefined) {
            return Account.findAll({
                include: [{
                    model: AccountRole,
                    include: [Role],
                    where: {
                        roleId: criteria.roleIds
                    }
                }]
            })
        }

        return Account.findAll({
            include: [{
                model: AccountRole,
                include: [Role]
            }]
        })
    }

    async findById(id: number): Promise<Account | null> {
        return Account.findByPk(id, {
            include: [{
                model: AccountRole,
                include: [Role]
            }]
        })
    }

    public async findByIdOrError(id: number): Promise<Account> {
        const account: Account | null = await Account.findByPk(id)

        if(account == null) {
            throw new EntityNotFoundException(`Account with id ${id} not found`)
        }

        return account
    }
}
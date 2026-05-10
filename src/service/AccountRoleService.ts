import {AccountRole, IAccountRoleSample} from "../model/AccountRole";

export class AccountRoleService {
    async create(accountRoles: IAccountRoleSample[]): Promise<AccountRole[]> {
        return AccountRole.bulkCreate(accountRoles)
    }

    async deleteByAccountId(accountId: number): Promise<void> {
        await AccountRole.destroy({where: {accountId}})
    }
}
import {IAccountRoleSample} from "../model/AccountRole";

export class AccountRoleFactory {
    private constructor() {}

    static createAccountRoles(accountId: number, roleIds: number[]): IAccountRoleSample[] {
        return roleIds.map((roleId: number): IAccountRoleSample => {
            return {accountId, roleId}
        })
    }
}
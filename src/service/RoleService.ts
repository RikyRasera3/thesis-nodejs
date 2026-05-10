import {Role} from "../model/Role";
import {EntityNotFoundException} from "../exception/EntityNotFoundException";

export class RoleService {
    async findAllByRoleIds(roleIds: number[]): Promise<Role[]> {
        const roles: Role[] = await Role.findAll({ where: { id: roleIds } })

        if (roles.length !== roleIds.length) {
            const ids: string = roles.map((role: Role): number => role.id).join(", ")
            throw new EntityNotFoundException(`One or more role IDs not found [${ids}]`)
        }

        return roles
    }
}
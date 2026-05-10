import {
    Attribute,
    AutoIncrement,
    HasMany,
    Index,
    NotNull,
    PrimaryKey,
    Table
} from "@sequelize/core/decorators-legacy";
import {CreationOptional, DataTypes, Model, NonAttribute} from "@sequelize/core";
import {AccountRole} from "./AccountRole";

export interface IRoleSample {
    id?: CreationOptional<number>
}

@Table({schema: "thesis", tableName: "role", timestamps: true, underscored: true})
export class Role extends Model<IRoleSample, IRoleSample> {
    @PrimaryKey
    @AutoIncrement
    @Attribute(DataTypes.INTEGER)
    declare id: CreationOptional<number>

    @NotNull
    @Attribute(DataTypes.STRING)
    @Index({name: "role_code_uq", unique: true})
    declare code: string

    @NotNull
    @Attribute(DataTypes.STRING)
    declare description: string

    @NotNull
    @Attribute(DataTypes.DATE)
    declare createdAt: Date

    @Attribute(DataTypes.DATE)
    declare updatedAt: Date | null

    @HasMany(() => AccountRole, "roleId")
    declare accountRoles: NonAttribute<AccountRole[]>
}
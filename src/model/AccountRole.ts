import {Attribute, AutoIncrement, NotNull, PrimaryKey, Table} from "@sequelize/core/decorators-legacy";
import {CreationOptional, DataTypes, Model} from "@sequelize/core";

export interface IAccountRoleSample {
    id?: CreationOptional<number>
    accountId?: number
    roleId?: number
}

@Table({schema: "thesis", tableName: "account_role", timestamps: true, underscored: true})
export class AccountRole extends Model<IAccountRoleSample, IAccountRoleSample> {
    @PrimaryKey
    @AutoIncrement
    @Attribute(DataTypes.INTEGER)
    declare id: CreationOptional<number>

    @NotNull
    @Attribute(DataTypes.INTEGER)
    declare accountId: number

    @NotNull
    @Attribute(DataTypes.INTEGER)
    declare roleId: number

    @NotNull
    @Attribute(DataTypes.DATE)
    declare createdAt: Date

    @Attribute(DataTypes.DATE)
    declare updatedAt: Date | null
}
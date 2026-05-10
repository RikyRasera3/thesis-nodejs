import {CreationOptional, DataTypes, Model, NonAttribute} from "@sequelize/core";
import {
    Attribute,
    AutoIncrement, HasMany,
    Index,
    NotNull,
    PrimaryKey,
    Table
} from "@sequelize/core/decorators-legacy";
import {AccountRole} from "./AccountRole";

export interface IAccountSample {
    id?: CreationOptional<number>
    name?: string
    surname?: string
    email?: string
    phone?: string
    dateOfBirth?: Date
}

@Table({schema: "thesis", tableName: "account", timestamps: true, underscored: true})
export class Account extends Model<IAccountSample, IAccountSample> implements IAccountSample {
    @PrimaryKey
    @AutoIncrement
    @Attribute(DataTypes.INTEGER)
    declare id: CreationOptional<number>

    @NotNull
    @Attribute(DataTypes.STRING)
    declare name: string

    @NotNull
    @Attribute(DataTypes.STRING)
    declare surname: string

    @NotNull
    @Attribute(DataTypes.STRING)
    @Index({name: "account_email_uq", unique: true})
    declare email: string

    @NotNull
    @Attribute(DataTypes.STRING)
    @Index({name: "account_phone_uq", unique: true})
    declare phone: string

    @NotNull
    @Attribute(DataTypes.DATE)
    declare dateOfBirth: Date

    @NotNull
    @Attribute(DataTypes.DATE)
    declare createdAt: Date

    @Attribute(DataTypes.DATE)
    declare updatedAt: Date | null

    @HasMany(() => AccountRole, "accountId")
    declare accountRoles: NonAttribute<AccountRole[]>
}
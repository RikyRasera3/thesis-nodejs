import {Account} from "../model/Account";
import {Response} from "express";
import {IsInt, IsOptional} from "class-validator";
import {TCustomExpress} from "../util/types";

//-----------------------
// QUERY PARAMS
//-----------------------
export interface IGetAccountsCriteria {
    roleIds?: number[] | number
}

export class GetAccountsCriteria implements IGetAccountsCriteria {
    @IsInt({each: true})
    @IsOptional()
    roleIds?: number[] | number
}

//-----------------------
// Communication Types
//-----------------------
export type GetAccountsRequestType = TCustomExpress<null, GetAccountsCriteria>
export type GetAccountsResponseType = Response<Account[]>
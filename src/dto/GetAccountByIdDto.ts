import {Request, Response} from "express";
import {Account} from "../model/Account";
import {IId, TCustomExpress} from "../util/types";
import {IsInt} from "class-validator";

//-----------------------
// PARAMS
//-----------------------
export interface IGetAccountByIdParam extends IId {}

export class GetAccountByIdParam implements IGetAccountByIdParam {
    @IsInt()
    id: number = null!
}

//-----------------------
// Communication Types
//-----------------------
export type GetAccountByIdRequestType = TCustomExpress<GetAccountByIdParam>
export type GetAccountByIdResponseType = Response<Account | null>
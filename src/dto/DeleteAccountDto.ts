import {Request, Response} from "express";
import {IId, TCustomExpress} from "../util/types";
import {IsInt} from "class-validator";

//-----------------------
// PARAMS
//-----------------------
export interface IDeleteAccountParam extends IId {}

export class DeleteAccountParam implements IDeleteAccountParam {
    @IsInt()
    id: number = null!
}

//-----------------------
// Communication Types
//-----------------------
export type DeleteAccountRequestType = TCustomExpress<DeleteAccountParam>
export type DeleteAccountResponseType = Response<null>
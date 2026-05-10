import {Account} from "../model/Account";
import {Request, Response} from "express";
import {IGetAccountsCriteria, GetAccountsCriteria} from "./GetAccountsDto";
import {IsInt, Min} from "class-validator";
import {IPagedResponse, TCustomExpress} from "../util/types";

//-----------------------
// QUERY PARAMS
//-----------------------
export interface ISearchAccountsCriteria extends IGetAccountsCriteria {
    page?: number
    size?: number
}

export class SearchAccountsCriteria extends GetAccountsCriteria implements ISearchAccountsCriteria {
    @IsInt()
    @Min(0)
    page: number = 0

    @IsInt()
    @Min(0)
    size: number = 10
}

//-----------------------
// Communication Types
//-----------------------
export type SearchAccountsRequestType = TCustomExpress<null, SearchAccountsCriteria>
export type SearchAccountsResponseType = Response<IPagedResponse<Account>>
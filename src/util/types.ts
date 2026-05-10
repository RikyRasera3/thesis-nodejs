import {NextFunction, Request, Response} from "express";

export interface IId {
    id: number
}

export interface IPage {
    size: number
    number: number
    totalElements: number
    totalPages: number
}

export interface IPagedResponse<T extends object> {
    content: T[]
    page: IPage
}

export type THandlerResponse = (req: any, _res: Response, next: NextFunction) => void

export type TCustomExpress<Param = null, Query = null, Body = null> = Request<any, Body> & {
    validatedParams?: Param,
    validatedQuery?: Query
}
import {Response} from "express";
import {IsEnum} from "class-validator";
import {FileType} from "../enum/FileType";
import {TCustomExpress} from "../util/types";

//-----------------------
// QUERY PARAMS
//-----------------------
export interface IGetTestResultsParam {
    file: FileType
}

export class GetTestResultsParam implements IGetTestResultsParam {
    @IsEnum(FileType)
    file: FileType = null!
}

//-----------------------
// Communication Types
//-----------------------
export type GetTestResultsRequestType = TCustomExpress<GetTestResultsParam>
export type GetTestResultsResponseType = Response<any[]>
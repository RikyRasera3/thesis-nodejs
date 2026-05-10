import "reflect-metadata";
import {Response} from "express";
import {IId, TCustomExpress} from "../util/types";
import {
    ArrayMinSize,
    IsDateString, IsInt,
    IsNotEmpty,
    IsOptional,
    IsString
} from "class-validator";

//-----------------------
// PARAMS
//-----------------------
export interface IUpdateAccountParam extends IId {}

export class UpdateAccountParam implements IUpdateAccountParam {
    @IsInt()
    id: number = null!
}

//-----------------------
// DTOs
//-----------------------
interface IUpdateAccountDto {
    name?: string
    surname?: string
    email?: string
    phone?: string
    dateOfBirth?: Date
    roleIds?: number[]
}

export class UpdateAccountDto implements IUpdateAccountDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    surname?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    email?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    phone?: string

    @IsDateString()
    @IsOptional()
    dateOfBirth?: Date

    @IsNotEmpty()
    @IsInt({each: true})
    @ArrayMinSize(1)
    @IsOptional()
    roleIds?: number[] = null!
}

//-----------------------
// Communication Types
//-----------------------
export type UpdateAccountRequestType = TCustomExpress<UpdateAccountParam, null, UpdateAccountDto>
export type UpdateAccountResponseType = Response<null>
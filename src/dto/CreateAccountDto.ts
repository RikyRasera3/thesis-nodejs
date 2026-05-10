import "reflect-metadata";
import {Request, Response} from "express";
import {Account} from "../model/Account";
import {IsDateString, IsNotEmpty, IsInt, IsString, MinLength} from "class-validator";

//-----------------------
// DTOs
//-----------------------
interface ICreateAccountDto {
    name: string
    surname: string
    email: string
    phone: string
    dateOfBirth: Date
    roleIds: number[]
}

export class CreateAccountDto implements ICreateAccountDto {
    @IsNotEmpty()
    @IsString()
    name: string = null!

    @IsNotEmpty()
    @IsString()
    surname: string = null!

    @IsNotEmpty()
    @IsString()
    email: string = null!

    @IsNotEmpty()
    @IsString()
    phone: string = null!

    @IsDateString()
    dateOfBirth: Date = null!

    @IsNotEmpty()
    @IsInt({each: true})
    @MinLength(1)
    roleIds: number[] = null!
}

//-----------------------
// Communication Types
//-----------------------
export type CreateAccountRequestType = Request<null, Account, CreateAccountDto>
export type CreateAccountResponseType = Response<Account>
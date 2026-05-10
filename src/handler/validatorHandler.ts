import {NextFunction, Response} from "express";
import {ClassType} from "class-transformer-validator";
import {Validator} from "../util/Validator";
import {THandlerResponse} from "../util/types";

function castParams(obj: any, names?: string[]): any {
    if(obj === undefined || !names?.length) {
        return obj ?? {}
    }

    const result: any = {...obj}

    names.forEach((name: string) => {
        const value: any = result[name]

        if(value === undefined) {
            return
        }

        switch(true) {
            case Array.isArray(value):
                result[name] = (value as string[]).map(Number)
                break
            case typeof value === "string" && value.includes(","):
                result[name] = value.split(",").map(Number)
                break
            default:
                result[name] = Number(value)
        }
    })

    return result
}

export function paramValidatorHandler<T extends object>(paramClassType: ClassType<T>, names?: string[]): THandlerResponse {
    return (req: any, _res: Response, next: NextFunction): void => {
        const castedParams: any = castParams(req.params, names)
        req.validatedParams = Validator.instance.transformAndValidateObjectSync(paramClassType, castedParams)
        next()
    }
}

export function queryParamValidatorHandler<T extends object>(queryParamClassType: ClassType<T>, names?: string[]): THandlerResponse {
    return (req: any, _res: Response, next: NextFunction): void => {
        const castedQuery: any = castParams(req.query, names)
        req.validatedQuery = Validator.instance.transformAndValidateObjectSync(queryParamClassType, castedQuery)
        next()
    }
}

export function bodyValidatorHandler<T extends object>(bodyClassType: ClassType<T>): THandlerResponse {
    return (req: any, _res: Response, next: NextFunction): void => {
        req.body = Validator.instance.transformAndValidateObjectSync(bodyClassType, req.body)
        next()
    }
}
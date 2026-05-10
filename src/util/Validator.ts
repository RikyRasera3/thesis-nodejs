import {ClassType, transformAndValidate, transformAndValidateSync} from "class-transformer-validator";
import {ValidationError, validate, validateSync} from "class-validator";
import {ValidatorError} from "../exception/ValidatorError";
import {Logger} from "log4js";
import {getLogger} from "./logger";

const logger: Logger = getLogger("Validator")

interface IValidator {
    validateObject(obj: object): Promise<void>
    validateObjectSync(obj: object): void
    transformAndValidateObject<T extends object>(classType: ClassType<T>, obj: object): Promise<T>
    transformAndValidateObjectSync<T extends object>(classType: ClassType<T>, obj: object): T
    transformAndValidateJson<T extends object>(classType: ClassType<T>, jsonString: string): Promise<T | T[]>
    transformAndValidateJsonSync<T extends object>(classType: ClassType<T>, jsonString: string): T | T[]
}

export class Validator implements IValidator {
    private static _instance: Validator | null = null

    static get instance(): Validator {
        if(this._instance == null) {
            this._instance = new Validator()
        }

        return this._instance
    }

    private constructor() {}

    async validateObject(obj: object): Promise<void> {
        const errors: ValidationError[] = await validate(obj)
        this.checkErrors(errors)
    }

    validateObjectSync(obj: object): void {
        const errors: ValidationError[] = validateSync(obj)
        this.checkErrors(errors)
    }

    async transformAndValidateObject<T extends object>(classType: ClassType<T>, obj: object): Promise<T> {
        try {
            return await transformAndValidate(classType, obj)
        } catch(error: unknown) {
            this.throwValidationError(error)
        }
    }

    transformAndValidateObjectSync<T extends object>(classType: ClassType<T>, obj: object): T {
        try {
            return transformAndValidateSync(classType, obj)
        } catch(error: unknown) {
            this.throwValidationError(error)
        }
    }

    async transformAndValidateJson<T extends object>(classType: ClassType<T>, jsonStringified: string): Promise<T | T[]> {
        try {
            return await transformAndValidate(classType, jsonStringified)
        } catch(error: unknown) {
            this.throwValidationError(error)
        }
    }

    transformAndValidateJsonSync<T extends object>(classType: ClassType<T>, jsonStringified: string): T | T[] {
        try {
            return transformAndValidateSync(classType, jsonStringified)
        } catch(error: unknown) {
            this.throwValidationError(error)
        }
    }

    private checkErrors(errors: ValidationError[]): void {
        if(errors && errors.length > 0) {
            this.throwValidationError(errors)
        }
    }

    private throwValidationError(error: unknown): never {
        if(Array.isArray(error) && error.length > 0 && error[0] instanceof ValidationError) {
            const validationErrors = error as ValidationError[]
            const constraints = {}

            validationErrors.forEach((err: ValidationError): void => {
                if(err.children) {
                    err.children.forEach((e: ValidationError) => Object.assign(constraints, e.constraints))
                }
            })

            validationErrors.forEach((err: ValidationError): void => {
                if(err.constraints) {
                    Object.assign(constraints, err.constraints)
                }
            })

            const failures: string = Object.entries(constraints)
                .map((tuple: [string, unknown]) => `${tuple[0]}:${tuple[1]}\n `)
                .reduce((p: string, c: string) => `${p}${c}`, "")

            const failureMessage: string = "Invalid object detected:\n".concat(JSON.stringify(validationErrors), "\n", error.toString().trim(), "\n", failures)
            logger.error(`Validation failed: ${failureMessage}`, error)
            throw new ValidatorError(failureMessage, error)
        }

        logger.error("Validation failed", error)
        throw new Error(`Invalid object detected`, {cause: error})
    }
}
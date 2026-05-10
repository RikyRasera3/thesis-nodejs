import {ValidationError} from "class-validator";

export interface IErrorWithData<D> {
    data: D
}

export class ValidatorError extends Error implements IErrorWithData<ValidationError[]> {
    data: ValidationError[]

    constructor(message: string, data: ValidationError[]) {
        super(message)
        this.data = data
    }
}
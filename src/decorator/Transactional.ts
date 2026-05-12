import {Logger} from "log4js";
import {getLogger} from "../util/logger";
import {SequelizeHolder} from "../application/Database";

const logger: Logger = getLogger("Transactional")

export function Transactional(): any {
    return (_target: object, methodName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
        const method: any = propertyDescriptor.value

        propertyDescriptor.value = async function(...args: any[]): Promise<any> {
            logger.debug(`Transaction started for method ${methodName}`)

            const transactionFn = async (): Promise<any> => {
                return method.apply(this, args)
            }

            try {
                const result: any = await SequelizeHolder.get().transaction(transactionFn)
                logger.debug(`Transaction committed for method ${methodName}`)
                return result
            } catch(error: unknown) {
                logger.debug(`Transaction rolled back for method ${methodName}`)
                throw error
            }
        }

        return propertyDescriptor
    }
}
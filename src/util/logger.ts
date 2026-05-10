import log4js, {Logger} from "log4js";

export function getLogger(className: string): Logger {
    const logger: Logger = log4js.getLogger(className)

    return new Proxy(logger, {
        get(target: Logger, prop: string | symbol, receiver: any) {
            target.level = process.env.LOGS_ENABLED === "true" ? "debug" : "error"
            return Reflect.get(target, prop, receiver)
        }
    })
}

export function getAlwaysOnLogger(className: string): Logger {
    const logger: Logger = log4js.getLogger(className)
    logger.level = "debug"
    return logger
}
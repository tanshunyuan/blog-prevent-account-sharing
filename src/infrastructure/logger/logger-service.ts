import { env } from 'process';
import winston from 'winston';
import { consoleTransport, esTransport } from './transport';

interface LoggerConfigGeneratorResult {
  level: winston.LoggerOptions["level"];
  format: winston.LoggerOptions["format"];
  transports: winston.LoggerOptions["transports"];
}

type CustomMeta = {
  details: string | object
}

class LoggerService {
  private readonly logger: winston.Logger
  constructor() {
    const loggerConfig = this.loggerConfigGenerator();
    const logger = winston.createLogger(loggerConfig);
    this.logger = logger
  }

  private loggerConfigGenerator(): LoggerConfigGeneratorResult {
    const { combine, timestamp, json, colorize, prettyPrint, errors } =
      winston.format;

    switch (env.NODE_ENV) {
      case "production":
        return {
          level: "info",
          format: combine(timestamp(), json(), errors({ stack: true })),
          transports: [consoleTransport, esTransport],
        };
      default:
        return {
          level: "debug",
          format: combine(
            timestamp(),
            json(),
            prettyPrint(),
            colorize({
              all: true,
            }),
            errors({ stack: true }),
          ),
          transports: [
            consoleTransport,
          ],
        };
    }
  };

  private handleDetails(meta: CustomMeta) {
    if (typeof meta.details === 'object') meta.details = JSON.stringify(meta.details)
    return meta
  }

  public debug(message: string, meta: CustomMeta) {
    this.logger.debug(message, this.handleDetails(meta))
  }

  public info(message: string, meta: CustomMeta) {
    this.logger.info(message, this.handleDetails(meta))
  }

  public warn(message: string, meta: CustomMeta) {
    this.logger.warn(message, this.handleDetails(meta))
  }

  public error(message: string, meta: CustomMeta) {
    this.logger.error(message, this.handleDetails(meta))
  }

}

const logger = new LoggerService()
export default logger

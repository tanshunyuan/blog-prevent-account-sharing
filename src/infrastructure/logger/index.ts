import winston, { type Logger, type LeveledLogMethod } from "winston";
import { env } from "~/env.js";
import { consoleTransport, esTransport } from "./transport";

type CustomLogLeveledMethod = (message: string, meta: { details: string }) => Logger;
type OmittedLogMethod = Omit<LeveledLogMethod, 'debug' | 'info' | 'warn' | 'error'>;

interface CustomLogger extends OmittedLogMethod {
  debug: CustomLogLeveledMethod;
  info: CustomLogLeveledMethod;
  warn: CustomLogLeveledMethod;
  error: CustomLogLeveledMethod;
}


interface LoggerConfigGeneratorResult {
  level: winston.LoggerOptions["level"];
  format: winston.LoggerOptions["format"];
  transports: winston.LoggerOptions["transports"];
}

const { combine, timestamp, json, colorize, prettyPrint, errors } =
  winston.format;

const loggerConfigGenerator = (): LoggerConfigGeneratorResult => {
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
          // colorize({
          //   all: true,
          // }),
          errors({ stack: true }),
        ),
        transports: [
          consoleTransport,
          esTransport
        ],
      };
  }
};

const loggerConfig = loggerConfigGenerator();
const logger = winston.createLogger(loggerConfig) as CustomLogger;

export default logger;
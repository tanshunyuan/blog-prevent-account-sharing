import winston from "winston";
import {
  ElasticsearchTransformer,
  ElasticsearchTransport,
  LogData,
} from "winston-elasticsearch";

import { env } from "~/env.js";
import { esClient } from "../external-libraries/elasticsearch";

export const consoleTransport = new winston.transports.Console();

export const esTransport = new ElasticsearchTransport({
  index: env.ELASTICSEARCH_INDEX,
  client: esClient,
  useTransformer: true,
  transformer: (logData: LogData) => {
    const transformed = ElasticsearchTransformer(logData);
    return transformed;
  },
});

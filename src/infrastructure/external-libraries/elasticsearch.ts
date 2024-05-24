import { Client } from "@elastic/elasticsearch";
import { env } from "~/env.js";

export const esClient = new Client({
  node: env.ELASTICSEARCH_URL,
  auth: {
    username: env.ELASTICSEARCH_USERNAME,
    password: env.ELASTICSEARCH_PASSWORD,
  },
});
  
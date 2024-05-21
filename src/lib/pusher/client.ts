import PusherClient from "pusher-js";
import { env } from "~/env.js";

const PUSHER_AUTH_ENDPOINT = "/api/pusher/auth";
export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: PUSHER_AUTH_ENDPOINT,
});

import { getPusherInstance } from "~/lib/pusher/server";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  console.log("pusher/auth.handler", {
    details: "authenticating pusher perms...",
  });
  // see https://pusher.com/docs/channels/server_api/authenticating-users
  const data = await req.text();
  const [socket_id, channel_name] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  console.log("pusher/auth.handler", {
    details: {
      socket_id,
      channel_name,
    },
  });

  // use JWTs here to authenticate users before continuing

  try {
    const auth = pusherServer.authorizeChannel(socket_id!, channel_name!);
    return new Response(JSON.stringify(auth));
  } catch (error) {
    console.error("pusher/auth.handler.catch", { details: error });
  }
}

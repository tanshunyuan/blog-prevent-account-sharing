import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import z from 'zod'
import { getPusherInstance } from '~/lib/pusher/server';

const pusherServer = getPusherInstance();

export const userRouter = createTRPCRouter({
  getExcessSessions: publicProcedure.input(z.object({
    userId: z.string(),
    currentSessionId: z.string()
  })).query(async ({ input }) => {
    const { userId, currentSessionId } = input;

    const { data: activeSessions } = await clerkClient.sessions.getSessionList({
      userId,
      status: "active",
    });

    console.log("getExccessSessions.activeSessions.length", {
      details: {
        noOfActiveSessions: activeSessions.length,
      },
    });

    if (activeSessions.length <= 1) return null;

    const excessSessionsIds = activeSessions
      .filter((session) => session.id !== currentSessionId)
      .map((session) => session.id);

    console.log("getExccessSessions.excessSessionsIds", {
      details: {
        excessSessionsIds,
      },
    });

    // const revokeSessionsPromises = excessSessionsIds.map((sessionId) =>
    //   clerkClient.sessions.revokeSession(sessionId),
    // );

    // try {
    //   await Promise.all(revokeSessionsPromises).then(async () => {
    //     await pusherServer
    //       .trigger("private-session", `evt::revoke-${userId}`, {
    //         type: "session-revoked",
    //         data: excessSessionsIds,
    //       })
    //       .then(() =>
    //         console.debug("pusherServer.trigger", { details: "SUCCESS" }),
    //       );
    //   });
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   return {};
    // }
  }),

})
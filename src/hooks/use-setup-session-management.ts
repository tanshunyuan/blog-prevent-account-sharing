/* eslint-disable @typescript-eslint/no-floating-promises */
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { pusherClient } from "~/lib/pusher/client";
import { ROUTE_PATHS } from "~/utils/route-paths";


const useHandleSignOut = () => {
  const router = useRouter();
  return () => router.push(`${ROUTE_PATHS.SIGNIN}?forcedRedirect=true`);
};

const useHandleSessionRemoval = () => {
  const { signOut, session: currentSession } = useClerk();
  const handleSignOut = useHandleSignOut();

  return async (excessSessionIds: string[]) => {
    try {
      const hasExcess = excessSessionIds.length > 0;
      const isCurrentSessionExcess =
        hasExcess && currentSession && excessSessionIds.includes(currentSession.id);

      if (!isCurrentSessionExcess) return;

      await signOut(handleSignOut, {
        sessionId: currentSession.id,
      });
    } catch (error) {
      console.error('Error removing session:', error);
    }
  };
};

let didInit = false;
export const useSubscribeToSessionChannel = () => {
  const { user } = useUser();
  const handleSessionRemoval = useHandleSessionRemoval();

  useEffect(() => {
    if (!didInit) {
      const channel = pusherClient
        .subscribe("private-session")
        .bind(
          `evt::revoke-${user?.id}`,
          (data: { type: string; data: string[] }) => {
            if (data.type === "session-revoked") {
              handleSessionRemoval(data.data)
            }
          },
        );
      didInit = true;

      return () => {
        channel.unbind();
        didInit = false;
      };
    }
  }, [user, handleSessionRemoval]);
};
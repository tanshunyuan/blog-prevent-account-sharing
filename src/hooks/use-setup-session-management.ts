/* eslint-disable @typescript-eslint/no-floating-promises */
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { pusherClient } from "~/lib/pusher/client";
import { ROUTE_PATHS } from "~/utils/route-paths";

type UseSetupSessionChannelReturn = ReturnType<typeof useSetupSessionChannel>;

let didInitOne = false;
export const useSetupSessionChannel = () => {
  const [isReload, setIsReload] = useState(false);
  const [excessSessionIds, setExcessSessionIds] = useState<string[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!didInitOne) {
      const channel = pusherClient
        .subscribe("private-session")
        .bind(
          `evt::revoke-${user?.id}`,
          (data: { type: string; data: string[] }) => {
            if (data.type === "session-revoked") {
              setIsReload(true);
              setExcessSessionIds(data.data);
            }
          },
        );
      didInitOne = true;

      return () => {
        channel.unbind();
        didInitOne = false;
      };
    }
  }, [user]);

  return {
    isReload,
    setIsReload,
    excessSessionIds,
  };
};

type UseRemoveExcessSessionsProps = UseSetupSessionChannelReturn;

export const useRemoveExcessSessions = (
  props: UseRemoveExcessSessionsProps,
) => {
  const { isReload, setIsReload, excessSessionIds } = props;
  const { signOut, session: currentSession } = useClerk();
  const router = useRouter();

  const handleSignOutActions = useCallback(() => {
    router.push(`${ROUTE_PATHS.SIGNIN}?forcedRedirect=true`);
  }, [router]);

  const handleSessionRemoval = useCallback(async () => {
    try {
      const hasExcess = excessSessionIds.length > 0;
      const isCurrentSessionExcess =
        hasExcess &&
        currentSession &&
        excessSessionIds.includes(currentSession.id);

      if (!isCurrentSessionExcess) return;

      await signOut(handleSignOutActions, {
        sessionId: currentSession.id,
      });
    } catch (error) {
      console.error("Error removing session:", error);
    }
  }, [currentSession, excessSessionIds, handleSignOutActions, signOut]);

  useEffect(() => {
    if (!isReload) return;
    handleSessionRemoval();

    return () => {
      setIsReload(false);
    };
  }, [isReload, handleSessionRemoval, setIsReload]);
};

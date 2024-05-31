/* eslint-disable @typescript-eslint/no-floating-promises */

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { ROUTE_PATHS } from "~/utils/route-paths";
import { type useSetupSessionChannel } from "./use-setup-session-management";

type UseRemoveExcessSessionsProps = ReturnType<typeof useSetupSessionChannel>;

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

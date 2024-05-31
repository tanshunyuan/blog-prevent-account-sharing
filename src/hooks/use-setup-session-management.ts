/* eslint-disable @typescript-eslint/no-floating-promises */
import { useUser } from "@clerk/nextjs";

import { useEffect, useState } from "react";
import { pusherClient } from "~/lib/pusher/client";


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


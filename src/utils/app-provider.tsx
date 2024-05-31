'use client'
import { useRemoveExcessSessions } from "~/hooks/use-remove-excess-sessions";
import { useSetupSessionChannel } from "~/hooks/use-setup-session-management";
import { api } from "~/trpc/react";
import { type BaseChildrenProps } from "~/types/common";

export const AppProvider = (props: BaseChildrenProps) => {
  const { children } = props

  const { excessSessionIds, isReload, setIsReload } = useSetupSessionChannel();
  const excessSessionQuery = api.user.getExcessSessions.useQuery()

  useRemoveExcessSessions({
    excessSessionIds,
    isReload,
    setIsReload,
  });

  if (excessSessionQuery.isLoading) return <p>Loading...</p>

  return <>
    {children}
  </>
}
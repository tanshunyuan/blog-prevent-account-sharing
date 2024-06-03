'use client'
import { useSubscribeToSessionChannel } from "~/hooks/use-setup-session-management";
import { api } from "~/trpc/react";
import { type BaseChildrenProps } from "~/types/common";

export const AppProvider = (props: BaseChildrenProps) => {
  const { children } = props

  useSubscribeToSessionChannel();
  const excessSessionQuery = api.user.getExcessSessions.useQuery()

  if (excessSessionQuery.isLoading) return <p>Loading...</p>

  return <>
    {children}
  </>
}
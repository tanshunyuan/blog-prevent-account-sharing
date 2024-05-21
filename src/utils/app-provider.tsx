'use client'
import { useClerk } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { type BaseChildrenProps } from "~/types/common";

export const AppProvider = (props: BaseChildrenProps) => {
  const { children } = props
  const { user, session } = useClerk()

  const excessSessionQuery = api.user.getExcessSessions.useQuery({
    userId: user!.id,
    currentSessionId: session!.id
  }, {
    enabled: !!(user && session)
  })

  if (excessSessionQuery.isLoading) return <p>Loading...</p>

  return <>
    {children}
  </>
}
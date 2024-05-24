'use client';
import { SignOutButton } from "@clerk/nextjs";
import { api } from "~/trpc/react";

export default function DashboardPage() {
  const userQuery = api.user.getThings.useQuery()

  if (userQuery.isLoading) return <p>Loading...</p>
  return <div className="p-4">
    <p>
      Private Content
    </p>
    <pre>
      {userQuery.data?.hello}
    </pre>
    <SignOutButton />
  </div>
}
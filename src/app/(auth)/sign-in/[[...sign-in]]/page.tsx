"use client";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTE_PATHS } from "~/utils/route-paths";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const forcedRedirect = searchParams.get("forcedRedirect");

  useEffect(() => {
    if (forcedRedirect) {
      toast.error('Detected additional sessions, kicking you out');
      router.replace(ROUTE_PATHS.SIGNIN, undefined);
    }
  }, [forcedRedirect]);
  return (
    <SignIn />
  );
}

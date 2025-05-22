"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/auth-client";

import { UserButton } from "./user-button";

// Skeleton for the auth button
const AuthButtonSkeleton = () => (
  <div className="mx-2">
    <Skeleton className="h-8 w-8 rounded-full" />
  </div>
);

// Inner logic component for session logic
const AuthContent = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) return <AuthButtonSkeleton />;

  return (
    <div className="mx-2 h-8 w-8">
      {user ? (
        <UserButton />
      ) : (
        <Link href="/sign-in" className="cursor-pointer">
          <Button variant="ghost" size={"icon"}>
            <Image src="/user-sm.png" width={22} height={22} alt="user" />
          </Button>
        </Link>
      )}
    </div>
  );
};

// Export with Suspense wrapper
export const AuthButton = () => (
  <Suspense fallback={<AuthButtonSkeleton />}>
    <AuthContent />
  </Suspense>
);

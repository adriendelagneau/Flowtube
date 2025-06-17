"use client";

import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/auth-client";
import { useAuthModal } from "@/lib/store/useAuthStore";

import { UserButton } from "./user-button";

// Inner logic component for session logic
export const AuthButton = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const { toggle } = useAuthModal();

  return (
    <div className="">
      {isPending ? (
        <div className="flex h-10 w-10 items-center justify-center">
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      ) : user ? (
        <UserButton />
      ) : (
        <Button
          variant="ghost"
          size={"icon"}
          className="cursor-pointer"
          onClick={() => toggle()}
        >
          {/* <Image src="/user-sm.png" width={35} height={35} alt="user" /> */}
          <UserIcon />
        </Button>
      )}
    </div>
  );
};

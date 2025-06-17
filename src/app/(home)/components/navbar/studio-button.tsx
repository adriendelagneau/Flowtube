"use client";

import { Clapperboard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export const StudioButton = () => {
  const { data: session } = authClient.useSession();

  const handleClick = (e: React.MouseEvent) => {

    // Block unauthenticated users from accessing the studio page (also handled by middleware).
    if (!session) {
      e.preventDefault();
      toast("Please sign in to create content");
    }
  };

  return (
    <Button
      asChild
      variant="ghost"
      aria-label="Create New Content"
      onClick={handleClick}
      className="h-[40px] w-[40px] sm:w-auto"
    >
      <Link href="/studio">
        <Clapperboard className="sm:hidden" />
        <span className="hidden items-center sm:flex">
          <Clapperboard className="mr-2" />
          Studio
        </span>
      </Link>
    </Button>
  );
};

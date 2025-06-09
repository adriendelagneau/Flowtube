"use client";
import { Clapperboard } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export const StudioButton = () => {
  const { data: session } = authClient.useSession();

  const handleClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault(); // 🚫 Stop navigation
      toast("Please sign in to create content");
    }
  };

  return (
    <Link href="/studio">
      <Button
        asChild
        variant="ghost"
        className="sm:variant-outline sm:border sm:px-4 sm:py-2"
        aria-label="Create New Content"
        onClick={handleClick}
        size={"lg"}
      >
        <div>
          {/* Mobile: icon only */}
          <Clapperboard className="h-5 w-5 sm:hidden" />
          {/* Desktop: icon + text */}
          <span className="hidden items-center sm:flex">
            <Clapperboard strokeWidth={1} className="mr-2 h-5 w-5" />
            Studio
          </span>
        </div>
      </Button>
    </Link>
  );
};



import { Clapperboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { AuthButton } from "./auth-button";
import { SearchInput } from "./search-input";
import { SearchInputSm } from "./search-input-sm";
import { ThemeToggleButton } from "./theme-toggle-button";

export const HomeNavbar = () => {
  return (
    <div className="bg-background fixed top-0 left-0 z-50 flex h-16 w-full items-center px-2 pr-5">
      <div className="flex w-full items-center gap-2 md:gap-4">
        {/** Menu & Logo */}
        <div className="flex flex-shrink-0 items-center">
          <SidebarTrigger className="ml-2 cursor-pointer" />
          <Link href={"/"}>
            <div className="flex items-center gap-1 p-4">
              <Image src="/logo.svg" alt="logo" width={32} height={32} />
              <p className="hidden text-xl font-semibold tracking-tight md:block">
                FLOWTUBE
              </p>
            </div>
          </Link>
        </div>

        {/** Search bar */}
        <div className="mx-auto flex max-w-[720px] flex-1 justify-center">
          <SearchInput />
        </div>

        <div className="flex flex-shrink-0 items-center gap-1 md:gap-2">
          {/** Mobile: search button */}
          <SearchInputSm />

          {/** Studio button */}
          <Link href="/studio">
            <Button
              asChild
              variant="ghost"
              className="sm:variant-outline sm:border sm:px-4 sm:py-2"
              aria-label="Create New Content"
            >
              <div>
                {/* Mobile: ghost variant with icon only */}
                <Clapperboard className="h-5 w-5 sm:hidden" />

                {/* Desktop: outline style with text and icon */}
                <span className="hidden items-center sm:flex">
                  <Clapperboard strokeWidth={1} className="mr-2 h-4 w-4" />
                  Studio
                </span>
              </div>
            </Button>
          </Link>

          {/** notification */}
          {/* <NotificationButton /> */}

          {/** toggle theme button */}
          <ThemeToggleButton />

          {/** auth button */}
          <AuthButton />
        </div>
      </div>
    </div>
  );
};

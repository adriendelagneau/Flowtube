import { BellRingIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ThemeToggleButton } from "./theme-toggle-button";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

// import { AuthButton } from "./auth-button";
import { AuthButton } from "./auth-button";
import { SearchInput } from "./search-input";
import { SearchInputSm } from "./search-input-sm";
import { StudioButton } from "./studio-button";

export const HomeNavbar = async () => {
  return (
    <div className="bg-background fixed top-0 left-0 z-50 flex h-16 w-full items-center px-2">
      <div className="flex w-full items-center gap-2 md:gap-4">
        {/** Menu & Logo */}
        <div className="flex flex-shrink-0 items-center h-10">
          <SidebarTrigger className="cursor-pointer w-10 h-10" />
          <Link href={"/"}>
            <div className="flex items-center gap-1 p-4">
              <Image src="/logo3.png" alt="logo" width={28} height={28} />
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

        <div className="flex flex-shrink-0 items-center gap-0.5 md:gap-0.5">
          {/** Mobile: search button */}
          <SearchInputSm />

          {/** Studio button */}
          <StudioButton />


          {/** toggle theme button */}
          <ThemeToggleButton />

        
          {/** notification */}
          {/* <NotificationButton /> */}
          <Button size={"icon"} variant={"ghost"} className="cursor-pointer relative">
            <BellRingIcon />
            <span className="h-2.5 w-2.5 rounded-full absolute top-1.5 dark:bg-500 right-1.5 bg-red-700"></span>
          </Button>

          {/** auth button */}
          <AuthButton />

          {/* <Suspense fallback={<AuthButtonSkeleton />}>
              <AuthButton />
            </Suspense> */}
        </div>
      </div>
    </div>
  );
};

// const AuthButtonSkeleton = () => (
//   <div>
//     <Skeleton className=" mx-2 h-7 w-7 rounded-full" />
//   </div>
// );

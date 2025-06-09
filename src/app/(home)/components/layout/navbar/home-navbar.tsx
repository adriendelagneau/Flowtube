import Image from "next/image";
import Link from "next/link";

import { ThemeToggleButton } from "@/components/buttons/theme-toggle-button";
import { SidebarTrigger } from "@/components/ui/sidebar";

// import { AuthButton } from "./auth-button"; 
import { AuthButton } from "./auth-button";
import { SearchInput } from "./search-input";
import { SearchInputSm } from "./search-input-sm";
import { StudioButton } from "./studio-button";


export const HomeNavbar = async () => {
  return (
    <div className="bg-background fixed top-0 left-0 z-50 flex h-16 w-full items-center px-2 pr-5">
      <div className="flex w-full items-center gap-2 md:gap-4">
        {/** Menu & Logo */}
        <div className="flex flex-shrink-0 items-center">
          <SidebarTrigger className=" cursor-pointer" />
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
          <StudioButton />

          {/** notification */}
          {/* <NotificationButton /> */}

          {/** toggle theme button */}
          <ThemeToggleButton />

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
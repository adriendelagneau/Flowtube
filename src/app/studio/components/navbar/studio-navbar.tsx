import Image from "next/image";
import Link from "next/link";
import React from "react";

import { UserButton } from "@/app/(home)/components/navbar/user-button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import StudioUploadModal from "./studio-upload-modal";

export const StudioNavbar = () => {
  return (
    <nav className="bg-background fixed top-0 left-0 z-50 flex h-16 w-full items-center border-b px-2 pr-5 shadow-md">
      <div className="flex w-full items-center gap-4">
        {/** Menu & Logo */}
        <div className="flex flex-shrink-0 items-center">
          <SidebarTrigger />
          <Link href={"/studio"}>
            <div className="flex items-center gap-1 p-4">
              <Image src="/logo3.png" alt="logo" width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>

        <div className="flex-1" />
        <div className="flex flex-shrink-0 items-center gap-1">
   <StudioUploadModal />
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

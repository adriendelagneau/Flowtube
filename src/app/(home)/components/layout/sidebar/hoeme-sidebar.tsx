import React from "react";

import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { MainSection } from "./main-section";
import { PersonalSection } from "./personal-section";
import { SidebarHeader } from "./sidebar-header"; 

export const HomeSidebar = () => {
  return (
    <Sidebar className="z-40 border-none pt-16" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarHeader />
        <MainSection />
        <Separator />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
};

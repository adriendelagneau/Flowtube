import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";

import { StudioNavbar } from "./components/navbar/studio-navbar";
import { StudioSidebar } from "./components/sidebar/studio-sidebar";

export default async function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Make sidebar open state persist through reload
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

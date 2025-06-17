import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "./components/navbar/home-navbar";
import { HomeSidebar } from "./components/sidebar/hoeme-sidebar";



export default async function HomeLayout({
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
          <HomeNavbar />
          <div className="flex pt-[4rem]">
            <HomeSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
  );
}

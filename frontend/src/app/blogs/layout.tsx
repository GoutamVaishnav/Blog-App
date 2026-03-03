import React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebarr from "@/components/Sidebarr";

interface Blogprops {
  children: React.ReactNode;
}
const HomeLayout: React.FC<Blogprops> = ({ children }) => {
  return (
    <div>
      <SidebarProvider >
        <Sidebarr />
        <main className="w-full ">
          <div className="w-full min-h-[calc(100vh-45)] px-4">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default HomeLayout;

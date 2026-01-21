import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-72 fixed inset-y-0 z-50 shadow-xl">
        <Sidebar className="h-full w-72" />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      <div 
        className={cn(
            "fixed inset-0 z-50 bg-black/80 lg:hidden transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />
      <aside 
        className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-primary transition-transform duration-300 lg:hidden shadow-2xl",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar className="h-full w-72" />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
          <div className="w-full animate-in fade-in duration-500">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Database, LogOut, Package, FileText, Settings, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuthStore();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
        title: "User Management",
        icon: Users,
        href: "/admin/users",
    },
    {
        title: "Master Data",
        icon: Database,
        href: "/admin/master-data",
    },
    {
        title: "Inventory Overview",
        icon: Package,
        href: "/admin/inventory",
    },
    {
        title: "System Logs",
        icon: FileText,
        href: "/admin/logs",
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/admin/settings",
    },
  ];

  return (
    <div className={cn("flex flex-col h-screen bg-gradient-to-b from-[#1E3A8A] to-[#1E40AF] text-white shadow-2xl", className)}>
      {/* Sidebar Header with Logo */}
      <div className="h-20 flex items-center justify-center px-6 bg-black/10 border-b border-white/10 backdrop-blur-sm">
         <div className="flex items-center gap-3">
            <div className="bg-white/95 p-2 rounded-xl shadow-lg ring-2 ring-white/20 hover:scale-105 transition-transform">
                <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="h-9 w-9 object-contain"
                />
            </div>
            <div>
                <h1 className="font-bold text-xl tracking-tight leading-none text-white drop-shadow-sm">Enterprise</h1>
                <p className="text-[11px] text-blue-100 uppercase tracking-widest font-semibold mt-0.5">Admin Panel</p>
            </div>
         </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <nav className="space-y-1.5">
            <div className="px-3 mb-3 text-[10px] font-bold text-blue-200/70 uppercase tracking-widest">
                Navigation
            </div>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-white/15 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/20"
                      : "text-blue-50/90 hover:bg-white/10 hover:text-white hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Icon with gradient background on active */}
                    <div className={cn(
                      "p-2 rounded-lg transition-all",
                      isActive 
                        ? "bg-gradient-to-br from-blue-400 to-blue-600 shadow-md" 
                        : "bg-white/5 group-hover:bg-white/10"
                    )}>
                      <item.icon className="h-[18px] w-[18px]" strokeWidth={2.5} />
                    </div>
                    <span className="relative font-semibold tracking-wide">{item.title}</span>
                  </div>
                  
                  {/* Arrow indicator on hover/active */}
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-all",
                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0"
                  )} />
                  
                  {/* Active gradient overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
                  )}
                </Link>
              );
            })}
        </nav>
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-4 bg-black/20 border-t border-white/10 backdrop-blur-sm">
          <button 
            onClick={() => logout()}
            className="flex items-center justify-between gap-3 w-full rounded-xl px-4 py-3.5 text-[15px] font-semibold text-red-100 bg-red-900/30 hover:bg-red-900/50 hover:text-white hover:shadow-lg transition-all duration-200 group border border-red-400/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-all">
                <LogOut className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </div>
              <span className="tracking-wide">Sign Out</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>
      </div>
    </div>
  );
}

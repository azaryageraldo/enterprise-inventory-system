import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckCircle2, PackageSearch, FileBarChart, ChevronRight, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
    className?: string;
}

export function ManagerSidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/manager/dashboard",
    },
    {
        title: "Persetujuan",
        icon: CheckCircle2,
        href: "/manager/approvals",
    },
    {
        title: "Pantau Stok",
        icon: PackageSearch,
        href: "/manager/stock-monitoring",
    },
    {
        title: "Laporan",
        icon: FileBarChart,
        href: "/manager/reports",
    },
  ];

  return (
    <div className={cn("flex flex-col h-screen bg-gradient-to-b from-[#1e1b4b] to-[#312e81] text-white shadow-2xl", className)}>
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
                <p className="text-[11px] text-indigo-300 uppercase tracking-widest font-bold mt-0.5">Panel Atasan</p>
            </div>
         </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <nav className="space-y-1.5">
            <div className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Menu Manajemen
            </div>
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-white/10 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Icon with gradient background on active */}
                    <div className={cn(
                      "p-2 rounded-lg transition-all",
                      isActive 
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md" 
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
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/10">
                {user?.fullName?.charAt(0).toUpperCase() || "M"}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                    {user?.fullName || "Manager"}
                </p>
                <p className="text-[11px] text-slate-400 truncate font-medium">
                    {user?.role || "Supervisor"}
                </p>
            </div>
            <button 
                onClick={() => logout()}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-200 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                title="Sign Out"
            >
                <LogOut className="h-4 w-4" />
            </button>
        </div>
      </div>
    </div>
  );
}

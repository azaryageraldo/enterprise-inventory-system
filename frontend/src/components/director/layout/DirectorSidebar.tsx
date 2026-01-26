import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  PieChart
} from "lucide-react";

export function DirectorSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/director/dashboard",
    },
    {
      title: "Laporan Stok",
      icon: FileText,
      href: "/director/reports/stock",
    },
    {
      title: "Laporan Keuangan",
      icon: PieChart,
      href: "/director/reports/expenses",
    },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col text-slate-100 flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Direktur Portal
        </h2>
        <p className="text-xs text-slate-400 mt-1">Enterprise System</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn("h-4 w-4", location.pathname === item.href ? "text-blue-400" : "text-slate-500")} />
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <span className="font-bold text-blue-400 text-xs">DI</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">Pimpinan</p>
            <p className="text-xs text-slate-500 truncate">Direktur Utama</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useAuthStore } from "@/store/authStore";
import { User, Bell, Menu, Search, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function ManagerHeader({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm h-20">
      <div className="flex h-full items-center px-6 gap-4">
        <button className="lg:hidden p-2 hover:bg-slate-100 rounded-md transition-colors" onClick={onMenuClick}>
            <Menu className="h-6 w-6 text-slate-600" />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative w-full max-w-md ml-4 lg:ml-0">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <Input 
                placeholder="Cari data, laporan..." 
                className="pl-10 h-10 bg-slate-100/50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-full transition-all"
            />
        </div>
        
        <div className="ml-auto flex items-center gap-4">
            {/* Notification */}
            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

            {/* Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500/20">
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=6366f1&color=fff`} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                {user?.fullName?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col items-start text-sm">
                            <span className="font-semibold leading-none text-slate-700">{user?.fullName || "Manager"}</span>
                            <span className="text-xs text-slate-500 mt-0.5">{user?.role || "Supervisor"}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                            <p className="text-xs leading-none text-muted-foreground">manager@enterprise.com</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer rounded-md focus:bg-indigo-50 focus:text-indigo-700">
                        <User className="mr-2 h-4 w-4" />
                        Profil Saya
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-md focus:bg-indigo-50 focus:text-indigo-700">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifikasi
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer rounded-md">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="font-medium">Keluar</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

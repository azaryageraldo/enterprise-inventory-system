import { useAuthStore } from "@/store/authStore";
import { User, Bell, Menu, Search, ChevronDown } from "lucide-react";
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

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b shadow-sm h-20">
      <div className="flex h-full items-center px-6 gap-4">
        <button className="lg:hidden p-2 hover:bg-muted rounded-md" onClick={onMenuClick}>
            <Menu className="h-6 w-6 text-muted-foreground" />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative w-full max-w-md ml-4 lg:ml-0">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search anything..." 
                className="pl-10 h-10 bg-muted/20 border-muted focus-visible:ring-1 focus-visible:ring-primary/20 rounded-full"
            />
        </div>
        
        <div className="ml-auto flex items-center gap-4">
            {/* Notification */}
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-blue-50 hover:text-primary rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
            </Button>
            
            <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />

            {/* Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-muted/50 transition-colors focus:outline-none">
                        <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`} />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col items-start text-sm">
                            <span className="font-semibold leading-none">{user?.fullName || "Admin"}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{user?.role}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                        <span className="flex items-center font-medium">Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

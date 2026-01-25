import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(username.trim(), password.trim());
      
      // Check role to determine redirect path
      const user = useAuthStore.getState().user;
      console.log("Login success. User data:", user);
      console.log("User role:", user?.role, "Type:", typeof user?.role);
      
      if (user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user?.role === "PEGAWAI") { // Changed from EMPLOYEE to PEGAWAI based on backend Role enum
        navigate("/employee/dashboard");
      } else if (user?.role === "ATASAN") {
        navigate("/manager/dashboard");
      } else if (user?.role === "KEUANGAN") {
        navigate("/finance/dashboard");
      } else {
        navigate("/dashboard"); // Fallback
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left Column - Branding & Info */}
      <div className="hidden bg-primary lg:flex flex-col justify-between p-10 text-primary-foreground relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
           </svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold text-xl">
             <ShieldCheck className="h-6 w-6" />
             <span>Enterprise Secure</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
           <h1 className="text-4xl font-extrabold tracking-tight mb-4">
             Enterprise Inventory & Financial Management
           </h1>
           <p className="text-lg opacity-90">
             Streamline your operations with our integrated solution for total business control. 
             Efficient, Reliable, and Secure.
           </p>
        </div>

        <div className="relative z-10 text-sm opacity-75">
          &copy; 2026 Enterprise Systems Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/logo.png" 
                alt="System Logo" 
                className="h-60 w-auto object-contain mix-blend-multiply filter drop-shadow-sm"
              />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ex. admin, pegawai..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold transition-all hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="px-8 text-center text-sm text-muted-foreground">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Demo Access
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-muted rounded">admin / 12345</div>
                <div className="p-2 bg-muted rounded">pegawai / 12345</div>
                <div className="p-2 bg-muted rounded">atasan / 12345</div>
                <div className="p-2 bg-muted rounded">keuangan / 12345</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

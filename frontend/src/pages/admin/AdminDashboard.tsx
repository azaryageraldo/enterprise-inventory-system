import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Package, FileText, Wallet, Clock, ShieldAlert, ArrowUpRight } from "lucide-react";
import { dashboardApi, type DashboardStats } from "@/lib/dashboardApi";
import { formatCurrency } from "@/lib/utils"; // Assuming this utility exists or I'll implement inline
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM HH:mm");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full">
         <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-5 w-24" />
         </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
         </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="col-span-4 h-[300px] rounded-xl" />
            <Skeleton className="col-span-3 h-[300px] rounded-xl" />
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 gap-1">
                <Clock className="w-3 h-3" />
                Updated: Just now
            </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Total Users" 
            value={stats?.totalUsers.toString() || "0"} 
            icon={Users} 
            description="Registered employees"
            trend="+1 this week"
        />
        <StatsCard 
            title="Total Items" 
            value={stats?.totalItems.toString() || "0"} 
            icon={Package} 
            description="Inventory stock types"
            trend="Active items"
        />
        <StatsCard 
            title="Active Requests" 
            value={stats?.activeRequests.toString() || "0"} 
            icon={FileText} 
            description="Waiting for approval"
            trend={stats?.activeRequests ? "Needs attention" : "All clear"}
            alert={!!stats?.activeRequests}
        />
        <StatsCard 
            title="Total Expenses" 
            value={formatCurrency(stats?.totalExpenses || 0)} 
            icon={Wallet} 
            description="Approved total"
            trend="Current period"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Audit Logs */}
        <Card className="col-span-4 shadow-md border-blue-100/50">
          <CardHeader>
            <CardTitle>Recent System Activities</CardTitle>
            <CardDescription>Latest audit logs and data changes</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4 px-4">
                {stats?.recentActivities.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No recent activities</div>
                ) : (
                    stats?.recentActivities.map((log) => (
                        <div key={log.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                            <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
                                <div className="w-2 h-2 bg-current rounded-full" />
                            </div>
                            <div className="space-y-1 flex-1">
                                <p className="text-sm font-medium leading-none">
                                    {log.action} <span className="text-muted-foreground">on</span> {log.entityType}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                    By {log.username} - {formatDate(log.timestamp)}
                                </p>
                                <p className="text-xs text-muted-foreground italic truncate">
                                    {log.changes || "No details"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Logins */}
        <Card className="col-span-3 shadow-md border-blue-100/50">
          <CardHeader>
            <CardTitle>Recent Logins</CardTitle>
            <CardDescription>Latest user access history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                {stats?.recentLogins.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No logins recorded</div>
                ) : (
                    stats?.recentLogins.map((login) => (
                        <div key={login.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                    {login.username.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium leading-none">{login.username}</p>
                                    <p className="text-xs text-muted-foreground">{login.ipAddress}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    login.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {login.status}
                                </span>
                                <span className="text-xs text-muted-foreground">{formatDate(login.loginTime)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, description, trend, alert = false }: any) {
    return (
        <Card className={`${alert ? 'border-amber-200 bg-amber-50/30' : 'hover:shadow-md transition-shadow'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${alert ? 'text-amber-600' : 'text-blue-600'}`} />
            </CardHeader>
            <CardContent>
            <div className={`text-2xl font-bold ${alert ? 'text-amber-700' : ''}`}>{value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {alert && <ShieldAlert className="h-3 w-3 text-amber-600" />}
                {description}
            </p>
            {trend && <p className="text-[10px] text-muted-foreground mt-2 border-t pt-2 w-full flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> {trend}
            </p>}
            </CardContent>
        </Card>
    )
}

function getActionColor(action: string) {
    switch (action) {
        case 'CREATE': return 'bg-blue-100 text-blue-600';
        case 'UPDATE': return 'bg-amber-100 text-amber-600';
        case 'DELETE': return 'bg-red-100 text-red-600';
        default: return 'bg-gray-100 text-gray-600';
    }
}

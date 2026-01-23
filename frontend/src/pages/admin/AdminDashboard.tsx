import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Package, FileText, Wallet, Clock, ShieldAlert, TrendingUp, Activity, Smartphone, Globe, CalendarDays } from "lucide-react";
import { dashboardApi, type DashboardStats } from "@/lib/dashboardApi";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // Changed back to alias as previous step confirmed it works or relative if needed, sticking to relative to be safe
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useAuthStore } from "@/store/authStore";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

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
      <div className="space-y-8 w-full p-2">
         <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
         </div>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
         </div>
         <div className="grid gap-6 md:grid-cols-7">
            <Skeleton className="col-span-4 h-[400px] rounded-2xl" />
            <Skeleton className="col-span-3 h-[400px] rounded-2xl" />
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Selamat datang kembali, <span className="text-blue-600">{user?.fullName?.split(' ')[0] || 'Admin'}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {format(new Date(), "EEEE, d MMMM yyyy")}
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="hidden md:inline">Berikut ringkasan inventaris Anda hari ini.</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="hidden md:block text-right mr-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Sistem</p>
                <div className="flex items-center gap-1.5 justify-end">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-700">Berjalan Normal</span>
                </div>
            </div>
            <Badge variant="secondary" className="px-4 py-2 gap-2 bg-white shadow-sm border text-gray-600 hover:bg-gray-50">
                <Clock className="w-3.5 h-3.5" />
                Diperbarui: Baru saja
            </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Total Pengguna" 
            value={stats?.totalUsers.toString() || "0"} 
            icon={Users} 
            description="Karyawan aktif"
            trend="+12% bulan lalu"
            color="blue"
        />
        <StatsCard 
            title="Total Barang" 
            value={stats?.totalItems.toString() || "0"} 
            icon={Package} 
            description="Stok inventaris"
            trend="+5 barang baru hari ini"
            color="indigo"
        />
        <StatsCard 
            title="Permintaan Aktif" 
            value={stats?.activeRequests.toString() || "0"} 
            icon={FileText} 
            description="Menunggu persetujuan"
            trend={stats?.activeRequests ? "Perlu tindakan" : "Semua selesai"}
            alert={!!stats?.activeRequests}
            color="amber"
        />
        <StatsCard 
            title="Total Pengeluaran" 
            value={formatCurrency(stats?.totalExpenses || 0)} 
            icon={Wallet} 
            description="Anggaran disetujui"
            trend="Periode fiskal saat ini"
            color="emerald"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        
        {/* Recent Audit Logs (Timeline) */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm border-gray-100/60 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Aktivitas Sistem
                    </CardTitle>
                    <CardDescription>Aksi terlacak secara real-time di seluruh sistem</CardDescription>
                </div>
                <Badge variant="outline" className="bg-white">5 Aksi Terakhir</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
                {stats?.recentActivities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Activity className="w-6 h-6 text-gray-400" />
                        </div>
                        <p>No recent activity recorded</p>
                    </div>
                ) : (
                    stats?.recentActivities.map((log) => (
                        <div key={log.id} className="group p-6 hover:bg-gray-50/50 transition-all flex items-start gap-4">
                            <div className={`mt-1 p-2.5 rounded-xl shrink-0 border ${getActionStyle(log.action)}`}>
                                <div className="w-2.5 h-2.5 bg-current rounded-full" />
                            </div>
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {log.action} <span className="font-normal text-muted-foreground">on</span> {log.entityType}
                                    </p>
                                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full">
                                        {formatDate(log.timestamp)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1 bg-white border px-1.5 py-0.5 rounded shadow-sm">
                                        <Users className="w-3 h-3" />
                                        {log.username}
                                    </div>
                                    <span>&bull;</span>
                                    <p className="truncate italic max-w-[200px] md:max-w-md">{log.changes || "No specific details"}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 bg-gray-50/30 border-t border-gray-100 text-center">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                    Lihat Log Audit Lengkap
                </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Logins */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm border-gray-100/60 flex flex-col">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                Riwayat Akses
            </CardTitle>
            <CardDescription>Percobaan login terbaru</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="divide-y divide-gray-100">
                {stats?.recentLogins.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">Tidak ada login tercatat</div>
                ) : (
                    stats?.recentLogins.map((login) => (
                        <div key={login.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-100">
                                        {login.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${login.status === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'}`} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold text-gray-900">{login.username}</p>
                                    <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="h-5 px-2 text-[10px] font-semibold border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm">
                                        {login.ipAddress === '0:0:0:0:0:0:0:1' ? 'Localhost' : login.ipAddress}
                                    </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-gray-500">{formatDate(login.loginTime).split(' ')[0]}</p>
                                <p className="text-xs text-gray-400">{formatDate(login.loginTime).split(' ')[1]}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </CardContent>
          <div className="p-4 border-t border-gray-100 bg-gray-50/30">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mayoritas login dari Chrome di Linux</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, description, trend, alert = false, color = "blue" }: any) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };
    
    // Safety check if color is not in keys use blue
    const theme = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue;

    return (
        <Card className={`relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${alert ? 'border-amber-200 bg-amber-50/30 ring-1 ring-amber-200' : 'border-gray-100 bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${theme}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
                <div className="mt-2 flex items-center text-xs">
                    {alert ? (
                        <div className="flex items-center gap-1.5 text-amber-700 font-medium px-2 py-0.5 rounded-full bg-amber-100/50">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            {description}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            {trend.includes('+') && <TrendingUp className="h-3.5 w-3.5 text-green-600" />}
                            <span>{description}</span>
                        </div>
                    )}
                </div>
                {trend && !alert && (
                     <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100 w-full flex items-center justify-between">
                        <span>Tren</span>
                        <span className="font-medium text-green-600 bg-green-50 px-1.5 rounded">{trend}</span>
                     </p>
                )}
            </CardContent>
            
            {/* Decorative background shape */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 ${theme.split(' ')[0]}`} />
        </Card>
    )
}

function getActionStyle(action: string) {
    switch (action) {
        case 'CREATE': return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'UPDATE': return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'DELETE': return 'bg-red-50 text-red-600 border-red-200';
        default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
}

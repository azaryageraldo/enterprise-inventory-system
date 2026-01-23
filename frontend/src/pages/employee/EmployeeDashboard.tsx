import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Clock, CheckCircle2, AlertCircle, CalendarDays, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { id as localeId } from "date-fns/locale";

interface DashboardStats {
    totalStockTransactions: number;
    pendingExpenses: number;
    approvedExpensesSum: number;
    recentStockTransactions: Array<{
        id: number;
        item: { name: string };
        date: string;
        quantity: number;
        type: string;
    }>;
}

export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await api.get("/employee/dashboard");
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchStats();
  }, []);

  const quickStats = [
    {
      title: "Riwayat Transaksi",
      value: stats?.totalStockTransactions.toString() || "0",
      label: "Total transaksi barang",
      icon: Package,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
        title: "Klaim Tertunda",
        value: stats?.pendingExpenses.toString() || "0",
        label: "Menunggu persetujuan",
        icon: Clock,
        color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
        title: "Klaim Disetujui",
        value: stats ? `Rp ${(stats.approvedExpensesSum || 0).toLocaleString('id-ID')}` : "Rp 0",
        label: "Total disetujui",
        icon: CheckCircle2,
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Halo, <span className="text-emerald-600">{user?.fullName?.split(' ')[0] || 'Karyawan'}</span>! 👋
          </h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId })}
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline">Siap memulai hari Anda?</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all" asChild>
                <Link to="/employee/inventory">
                    <Plus className="w-4 h-4 mr-2" />
                    Ambil Barang
                </Link>
            </Button>
            <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
                <Link to="/employee/expenses">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajukan Klaim
                </Link>
            </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {quickStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">{isLoading ? "..." : stat.value}</h3>
                            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                    {/* Decorative shape */}
                    <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 ${stat.color.split(' ')[0]}`} />
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Activity / Requests */}
        <Card className="md:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800">Aktivitas Terkini</CardTitle>
                        <CardDescription>Riwayat pengambilan barang terakhir Anda</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" asChild>
                        <Link to="/employee/stock">Lihat Semua <ArrowRight className="w-4 h-4 ml-1" /></Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Memuat data...</div>
                    ) : stats?.recentStockTransactions.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">Belum ada aktivitas transaksi.</div>
                    ) : (
                        stats?.recentStockTransactions.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{item.item.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {format(new Date(item.date), "d MMM yyyy, HH:mm", { locale: localeId })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant={(item.type === 'IN' || item.type === 'ADJUSTMENT_ADD') ? "outline" : "secondary"} className={
                                        (item.type === 'IN' || item.type === 'ADJUSTMENT_ADD')
                                            ? "border-emerald-200 text-emerald-700 bg-emerald-50" 
                                            : "bg-slate-100 text-slate-700"
                                        }>
                                        {item.type === 'IN' ? '+' : '-'}{item.quantity} Unit
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>

        {/* Quick Links / Announcement */}
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-0 shadow-lg relative overflow-hidden">
                <CardContent className="p-6 relative z-10">
                    <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
                    <p className="text-indigo-100 text-sm mb-4">
                        Cek katalog inventaris untuk melihat barang yang tersedia sebelum membuat permintaan.
                    </p>
                    <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0" asChild>
                        <Link to="/employee/inventory">Jelajahi Katalog</Link>
                    </Button>
                </CardContent>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl" />
            </Card>

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Pengingat Kebijakan</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-2">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p>Semua permintaan pengeluaran di atas Rp 1.000.000 memerlukan persetujuan manajer.</p>
                    </div>
                     <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p>Barang inventaris harus dikembalikan dalam 30 hari jika ditandai "Sementara".</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

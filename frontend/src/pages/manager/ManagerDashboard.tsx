import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Clock, CheckCircle2, TrendingUp, AlertTriangle, 
    Package, ArrowRight, Wallet
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ManagerDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await api.get("/manager/dashboard");
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch manager stats", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
  };

  // Mapped Data for Stats Cards
  const statsData = [
    {
      title: "Pengeluaran Hari Ini",
      value: stats ? formatCurrency(stats.expensesToday) : "Rp 0",
      label: "Disetujui hari ini",
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      gradient: "from-emerald-500/10 to-transparent"
    },
    {
      title: "Pengeluaran Bulan Ini",
      value: stats ? formatCurrency(stats.expensesMonth) : "Rp 0",
      label: "Akumulasi bulan berjalan",
      icon: TrendingUp,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      gradient: "from-blue-500/10 to-transparent"
    },
    {
        title: "Menunggu Persetujuan",
        value: stats?.pendingExpensesCount.toString() || "0",
        label: "Pengajuan perlu ditinjau",
        icon: Clock,
        color: "text-amber-600 bg-amber-50 border-amber-100",
        gradient: "from-amber-500/10 to-transparent"
    },
    {
        title: "Stok Menipis",
        value: stats?.lowStockItemsCount.toString() || "0",
        label: "Item di bawah batas minimum",
        icon: AlertTriangle,
        color: "text-red-600 bg-red-50 border-red-100",
        gradient: "from-red-500/10 to-transparent"
    },
  ];

  if (isLoading) {
      return (
          <div className="space-y-8 p-6">
              <div className="flex justify-between items-center">
                  <div className="space-y-2">
                      <Skeleton className="h-8 w-64" />
                      <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid gap-6 md:grid-cols-4">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
              </div>
              <div className="grid gap-6 md:grid-cols-7">
                  <Skeleton className="md:col-span-4 h-96 rounded-xl" />
                  <Skeleton className="md:col-span-3 h-96 rounded-xl" />
              </div>
          </div>
      )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Halo, <span className="text-indigo-600">{user?.fullName}</span> 👋
          </h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm font-medium">
            {format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId })}
          </p>
        </div>
        <div className="flex gap-3">
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 rounded-full px-6 transition-all transform hover:scale-105" asChild>
                <Link to="/manager/approvals" className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Tinjau Pengajuan
                </Link>
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
            <Card key={index} className={`relative overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 group`}>
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} blur-2xl group-hover:blur-xl transition-all`}></div>
                <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.color} ring-1 ring-inset ring-black/5`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center mt-4 text-xs font-medium text-slate-500">
                        {stat.label}
                    </div> 
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7 items-start">
        {/* Pending Approvals */}
        <Card className="md:col-span-4 border-slate-200 shadow-sm overflow-hidden h-full">
            <CardHeader className="border-b border-slate-50 bg-white pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800">Menunggu Persetujuan</CardTitle>
                        <CardDescription>5 Pengajuan terbaru yang membutuhkan tindakan Anda</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" asChild>
                        <Link to="/manager/approvals" className="flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-600">Pegawai</TableHead>
                            <TableHead className="font-semibold text-slate-600">Keperluan</TableHead>
                            <TableHead className="font-semibold text-slate-600">Jumlah</TableHead>
                            <TableHead className="text-right font-semibold text-slate-600">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stats?.recentPendingExpenses && stats.recentPendingExpenses.length > 0 ? (
                            stats.recentPendingExpenses.map((req: any) => (
                                <TableRow key={req.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900">{req.user?.fullName}</span>
                                            <span className="text-[10px] text-slate-400 font-normal">
                                                {format(new Date(req.requestDate), "d MMM", { locale: localeId })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[150px] truncate text-slate-600" title={req.purpose}>
                                            {req.purpose}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-700">
                                        {formatCurrency(req.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="outline" className="h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700" asChild>
                                            <Link to="/manager/approvals">Tinjau</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <CheckCircle2 className="w-8 h-8 text-slate-300" />
                                        <p>Tidak ada pengajuan pending saat ini</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="md:col-span-3 border-slate-200 shadow-sm overflow-hidden h-full">
            <CardHeader className="border-b border-slate-50 bg-white pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Stok Menipis
                        </CardTitle>
                        <CardDescription>Item yang perlu segera di-restock</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                    {stats?.lowStockItems && stats.lowStockItems.length > 0 ? (
                        stats.lowStockItems.map((item: any) => (
                            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:scale-105 transition-transform">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-slate-200 text-slate-500 font-normal bg-white">
                                                Min: {item.minStock} {item.unit?.name}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-red-600">{item.stock}</span>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sisa</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                             <Package className="w-10 h-10 opacity-20" />
                             <p className="text-sm">Semua stok aman</p>
                        </div>
                    )}
                </div>
                {stats?.lowStockItemsCount > 5 && (
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                        <Button variant="link" size="sm" className="text-slate-500 text-xs h-auto py-0 hover:text-indigo-600" asChild>
                            <Link to="/manager/stock-monitoring">
                                Lihat {stats.lowStockItemsCount - 5} item lainnya
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


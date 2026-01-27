import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  FileCheck,
  Package,
  Calendar,
  AlertCircle,
  ArrowRight,
  FileText,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import axios from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DirectorDashboard() {
  const { token, user } = useAuthStore();
  const [stats, setStats] = useState({
    totalExpensesMonth: 0,
    pendingApprovals: 0,
    approvedUnpaid: 0,
    totalStockValue: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/director/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const formatCurrency = (amount: number) => {
    return `Rp ${amount?.toLocaleString("id-ID") || 0}`;
  };

  const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Selamat Pagi";
      if (hour < 15) return "Selamat Siang";
      if (hour < 18) return "Selamat Sore";
      return "Selamat Malam";
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
             {getGreeting()}, {user?.fullName || "Pimpinan"}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Berikut adalah ringkasan performa dan aktivitas terbaru perusahaan.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId })}
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Expenses */}
        <Card className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Pengeluaran (Bulan Ini)
            </CardTitle>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Wallet className="w-4 h-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(stats.totalExpensesMonth)}
            </div>
            <p className="text-xs text-slate-500">Total cash flow keluar bulan berjalan</p>
          </CardContent>
        </Card>

        {/* Card 2: Stock Value */}
        <Card className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Nilai Aset Stok
            </CardTitle>
             <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(stats.totalStockValue)}
            </div>
            <p className="text-xs text-slate-500">Estimasi valuasi persediaan di gudang</p>
          </CardContent>
        </Card>

         {/* Card 3: Pending Approvals */}
         <Card className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Menunggu Approval
            </CardTitle>
             <div className="p-2 bg-amber-50 rounded-lg">
              <FileCheck className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {stats.pendingApprovals} <span className="text-sm font-normal text-slate-500">Pengajuan</span>
            </div>
            <p className="text-xs text-slate-500">Membutuhkan persetujuan manajer/pimpinan</p>
          </CardContent>
        </Card>

        {/* Card 4: Approved Unpaid */}
        <Card className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Menunggu Pembayaran
            </CardTitle>
             <div className="p-2 bg-emerald-50 rounded-lg">
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {stats.approvedUnpaid} <span className="text-sm font-normal text-slate-500">Tagihan</span>
            </div>
             <p className="text-xs text-slate-500">Disetujui, menunggu proses finance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
          {/* Recent Activity Section - Takes 2 cols */}
          <Card className="md:col-span-2 shadow-md border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 py-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" /> 
                        Aktivitas Keuangan Terakhir
                    </CardTitle>
                    <CardDescription className="mt-1">5 transaksi pengeluaran terbaru yang tercatat sistem.</CardDescription>
                </div>
                 <Link to="/director/reports/expenses">
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                        Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {stats.recentActivity.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                <AlertCircle className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="font-medium">Belum ada aktivitas tercatat.</p>
                            <p className="text-sm mt-1">Transaksi pengeluaran akan muncul di sini.</p>
                        </div>
                    ) : (
                        stats.recentActivity.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{item.purpose}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                                {item.division}
                                            </span>
                                            <span className="text-xs text-slate-400">•</span>
                                            <span className="text-xs text-slate-500">
                                                {format(new Date(item.date), "d MMM yyyy, HH:mm", { locale: localeId })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                        -{formatCurrency(item.amount)}
                                    </p>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.transactionNumber}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Shortcuts - Takes 1 col */}
           <Card className="shadow-md border-slate-200 flex flex-col">
            <CardHeader className="border-b bg-slate-50/50 py-4">
                <CardTitle className="text-base font-semibold">Akses Cepat Laporan</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
                <div className="grid gap-3">
                    <Link to="/director/reports/general" className="group">
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                <Activity className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-slate-900 text-sm group-hover:text-indigo-700">Laporan Keseluruhan</h3>
                                <p className="text-xs text-slate-500 mb-0">Ringkasan finansial & stok</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link to="/director/reports/expenses" className="group">
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
                            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                <Wallet className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-slate-900 text-sm group-hover:text-emerald-700">Laporan Keuangan</h3>
                                <p className="text-xs text-slate-500 mb-0">Detail arus kas keluar</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link to="/director/reports/stock" className="group">
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-slate-900 text-sm group-hover:text-blue-700">Laporan Stok</h3>
                                <p className="text-xs text-slate-500 mb-0">Status inventaris gudang</p>
                            </div>
                             <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <h4 className="font-medium text-sm mb-2">Butuh Bantuan?</h4>
                    <p className="text-xs text-slate-300 mb-3">Hubungi tim IT jika terdapat kendala akses data atau sistem.</p>
                    <Link to="#" className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1">
                        Hubungi Support <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </CardContent>
           </Card>
      </div>
    </div>
  );
}

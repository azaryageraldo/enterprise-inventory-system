import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, FileCheck, ArrowRight, Banknote, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import axios from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function FinanceDashboard() {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPaidMonth: 0,
    pendingPaymentCount: 0,
    pendingPaymentAmount: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/finance/dashboard", {
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
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  if (isLoading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Selamat Datang, {user?.fullName}</h1>
          <p className="text-slate-500 mt-1">
            Ringkasan aktivitas keuangan dan persetujuan pembayaran Anda hari ini.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
           <Calendar className="h-4 w-4 text-slate-500" />
           {format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Total Paid This Month */}
        <Card className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Pengeluaran Bulan Ini</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full">
                         <Wallet className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalPaidMonth)}</span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span>Terupdate real-time</span>
                </p>
            </CardContent>
        </Card>
        
        {/* Card 2: Pending Approvals */}
        <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/finance/approvals")}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Siap Dibayar</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-100 rounded-full">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                     </div>
                    <div>
                        <span className="text-2xl font-bold text-slate-900">{stats.pendingPaymentCount}</span>
                        <span className="text-sm text-slate-500 ml-1">Pengajuan</span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 font-medium">
                    Total: <span className="text-slate-700">{formatCurrency(stats.pendingPaymentAmount)}</span>
                </p>
            </CardContent>
        </Card>

        {/* Card 3: Quick Action / Info */}
         <Card className="border-blue-100 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-100 uppercase tracking-wider">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex flex-col gap-3">
                   <p className="text-sm text-blue-50 mb-1">Ada {stats.pendingPaymentCount} tagihan yang siap untuk diproses pembayarannya sekarang.</p>
                   <Button variant="secondary" size="sm" className="w-full justify-between" onClick={() => navigate("/finance/approvals")}>
                        Proses Pembayaran <ArrowRight className="h-4 w-4" />
                   </Button>
               </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Aktivitas Pembayaran Terakhir</CardTitle>
                    <CardDescription>5 transaksi pengeluaran sukses terakhir.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/finance/history")}>
                    Lihat Semua <ArrowRight className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stats.recentActivity.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 flex flex-col items-center">
                            <Banknote className="h-10 w-10 mb-2 opacity-20" />
                            <p>Belum ada transaksi.</p>
                        </div>
                    ) : (
                        stats.recentActivity.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white border rounded-full shadow-sm">
                                        <Banknote className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{item.purpose}</p>
                                        <p className="text-xs text-slate-500">
                                            {format(new Date(item.date), "d MMM yyyy • HH:mm", { locale: localeId })} • {item.transactionNumber}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{formatCurrency(item.amount)}</p>
                                    <p className="text-xs text-slate-500">{item.user}</p>
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

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  FileCheck,
  Package,
  Calendar,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import axios from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function DirectorDashboard() {
  const { token } = useAuthStore();
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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
             Dashboard Eksekutif
          </h1>
          <p className="text-slate-500 mt-1">
            Ringkasan kesehatan finansial dan operasional perusahaan.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Card 1: Total Expenses */}
        <Card className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Total Pengeluaran (Bulan Ini)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-full">
                <Wallet className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {formatCurrency(stats.totalExpensesMonth)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Stock Value */}
        <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Nilai Aset Persediaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {formatCurrency(stats.totalStockValue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

         {/* Card 3: Pending Approvals */}
         <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Menunggu Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <FileCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {stats.pendingApprovals}
                </span>
                <span className="text-xs text-slate-500 ml-1">Pengajuan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Approved Unpaid */}
        <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Menunggu Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {stats.approvedUnpaid}
                </span>
                 <span className="text-xs text-slate-500 ml-1">Tagihan</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Aktivitas Keuangan Terakhir</CardTitle>
                    <CardDescription>Monitor transaksi pengeluaran terbaru dari seluruh divisi.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stats.recentActivity.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 flex flex-col items-center">
                            <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
                            <p>Belum ada aktivitas tercatat.</p>
                        </div>
                    ) : (
                        stats.recentActivity.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white border rounded-full shadow-sm">
                                        <TrendingUp className="h-5 w-5 text-indigo-500" />
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
                                    <p className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full inline-block mt-1">{item.division}</p>
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

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    TrendingUp, Calendar, Package, Loader2, ArrowUpRight 
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface DailyExpense {
    date: string;
    total: number;
}

interface DashboardStats {
    pendingExpensesCount: number;
    lowStockItemsCount: number;
    expensesToday: number;
    expensesMonth: number;
    totalStockCount: number;
    dailyExpenses: DailyExpense[];
}

export default function ManagerReportPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/manager/dashboard");
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch report stats", error);
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

    const formatDate = (dateStr: string) => {
        return format(new Date(dateStr), 'dd MMM', { locale: localeId });
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    // Transform daily expenses for Chart
    const chartData = stats?.dailyExpenses?.map(item => ({
        date: item.date,
        total: item.total
    })) || [];

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Laporan Ringkas</h1>
                    <p className="text-slate-500 mt-1">Analisis performa keuangan dan inventaris minggu ini.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium text-slate-600">
                    {format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId })}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Pengeluaran Hari Ini
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">
                            {formatCurrency(stats?.expensesToday || 0)}
                        </div>
                        <p className="text-xs text-emerald-600/80 mt-1 font-medium">
                            Disetujui hari ini
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Pengeluaran Bulan Ini
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">
                            {formatCurrency(stats?.expensesMonth || 0)}
                        </div>
                        <p className="text-xs text-blue-600/80 mt-1 font-medium">
                            Akumulasi bulan berjalan
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Total Stok
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Package className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">
                            {stats?.totalStockCount || 0} <span className="text-lg font-medium text-amber-600/70">Unit</span>
                        </div>
                        <p className="text-xs text-amber-600/80 mt-1 font-medium">
                            Total volume inventaris
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid gap-6 md:grid-cols-2">
                 {/* Expense Trend Chart */}
                <Card className="col-span-2 md:col-span-1 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-slate-500" />
                            Tren Pengeluaran (7 Hari Terakhir)
                        </CardTitle>
                        <CardDescription>
                            Grafik pengeluaran yang telah disetujui.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {chartData.length > 0 ? (
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={formatDate} 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        tickFormatter={(value) => `Rp${(value/1000).toFixed(0)}k`}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => [formatCurrency(Number(value)), 'Total']}
                                        labelFormatter={(label) => format(new Date(label), 'd MMMM yyyy', { locale: localeId })}
                                    />
                                    <Bar 
                                        dataKey="total" 
                                        fill="#0ea5e9" 
                                        radius={[4, 4, 0, 0]} 
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <TrendingUp className="w-10 h-10 mb-2 opacity-50" />
                                <p>Belum ada data pengeluaran minggu ini</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                 {/* Stock Status Placeholder (Future Enhancement: Category Distribution) */}
                <Card className="col-span-2 md:col-span-1 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-slate-500" />
                            Status Stok
                        </CardTitle>
                        <CardDescription>
                            Ringkasan kondisi inventaris saat ini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center relative">
                        {/* Simple Visualization for Stock Health */}
                        <div className="w-full h-full flex flex-col justify-center px-4 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-600">Stok Sehat</span>
                                    <span className="text-emerald-600">
                                        {stats ? (stats.totalStockCount > 0 ? (((stats.totalStockCount - stats.lowStockItemsCount)/stats.totalStockCount)*100).toFixed(1) : 0) : 0}%
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${stats ? (stats.totalStockCount > 0 ? (((stats.totalStockCount - stats.lowStockItemsCount)/stats.totalStockCount)*100) : 0) : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-600">Perlu Restock (Low Stock)</span>
                                    <span className="text-red-500">
                                        {stats ? (stats.lowStockItemsCount > 0 && stats.totalStockCount > 0 ? ((stats.lowStockItemsCount/stats.totalStockCount)*100).toFixed(1) : 0) : 0}%
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-red-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${stats ? (stats.lowStockItemsCount > 0 && stats.totalStockCount > 0 ? ((stats.lowStockItemsCount/stats.totalStockCount)*100) : 0) : 0}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    {stats?.lowStockItemsCount} items berada di bawah batas minimum stok.
                                </p>
                            </div>
                            
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 mt-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Insight</p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            {stats?.expensesToday && stats.expensesToday > 0 
                                                ? "Ada pengeluaran baru hari ini! Pantau tren di grafik sebelah kiri." 
                                                : "Belum ada pengeluaran yang disetujui hari ini."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

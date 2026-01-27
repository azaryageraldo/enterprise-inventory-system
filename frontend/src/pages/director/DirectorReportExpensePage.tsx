import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, Wallet, Building2, Calendar } from "lucide-react";
import axios from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { 
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

export default function DirectorReportExpensePage() {
    const { token } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/director/reports/expenses");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch expense reports", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }

    // Calculate highest spending division
    const highestDivision = data?.byDivision?.reduce((prev: any, current: any) => 
        (prev.value > current.value) ? prev : current
    , { name: "-", value: 0 });

    const currentMonthExpense = data?.byMonth?.length > 0 
        ? data.byMonth[data.byMonth.length - 1].value 
        : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Breadcrumb 
                items={[
                    { label: "Dashboard", href: "/director/dashboard" }, 
                    { label: "Laporan Keuangan" }
                ]} 
                homeLink="/director/dashboard"
            />
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Laporan Keuangan & Pengeluaran</h1>
                <p className="text-slate-500 mt-2">Analisis komprehensif arus kas keluar perusahaan berdasarkan periode dan divisi.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Pengeluaran (Lifetime)</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(data?.totalExpenses || 0)}</div>
                        <p className="text-xs text-slate-500 mt-1">Akumulasi seluruh pengeluaran yang disetujui</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pengeluaran Bulan Ini</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(currentMonthExpense)}</div>
                        <p className="text-xs text-slate-500 mt-1">Total pengeluaran pada bulan berjalan</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Divisi Terboros</CardTitle>
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{highestDivision?.name}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Sebesar <span className="font-medium text-amber-600">{formatCurrency(highestDivision?.value)}</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Monthly Trend Chart */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-1 shadow-md border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            Tren Pengeluaran Bulanan
                        </CardTitle>
                        <CardDescription>Grafik pergerakan pengeluaran dalam 12 bulan terakhir.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.byMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}jt`} 
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [formatCurrency(value as number), "Pengeluaran"]}
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#3B82F6" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Division Distribution Chart */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-1 shadow-md border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-indigo-500" />
                            Proporsi per Divisi
                        </CardTitle>
                        <CardDescription>Persentase kontribusi pengeluaran tiap divisi.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex flex-col justify-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.byDivision}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data?.byDivision.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => formatCurrency(value as number)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        
                        {/* Custom Legend */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {data?.byDivision.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div 
                                        className="w-3 h-3 rounded-full shrink-0" 
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                                    />
                                    <span className="text-slate-600 truncate">{entry.name}</span>
                                    <Badge variant="secondary" className="ml-auto text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                                        {(entry.value / (data?.totalExpenses || 1) * 100).toFixed(1)}%
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Detailed Table Section (Optional enhancement) */}
            <Card>
                <CardHeader>
                     <CardTitle>Rincian Nominal</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 font-medium text-sm text-slate-500 border-b">
                            <div className="col-span-6 md:col-span-8">Divisi</div>
                            <div className="col-span-6 md:col-span-4 text-right">Total Pengeluaran</div>
                        </div>
                        <div className="divide-y">
                            {data?.byDivision.map((item: any, index: number) => (
                                <div key={index} className="grid grid-cols-12 gap-4 p-4 text-sm hover:bg-slate-50/50 transition-colors">
                                    <div className="col-span-6 md:col-span-8 font-medium text-slate-900 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        {item.name}
                                    </div>
                                    <div className="col-span-6 md:col-span-4 text-right font-mono text-slate-700">
                                        {formatCurrency(item.value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

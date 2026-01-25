import { useState, useEffect } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Loader2, Calendar, Download, RefreshCw, PieChart as PieIcon, BarChart3 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function FinanceReportPage() {
    const [activeTab, setActiveTab] = useState("daily");
    const [loading, setLoading] = useState(false);
    
    // Data States
    const [summary, setSummary] = useState({ totalSpend: 0, totalTransactions: 0 });
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [divisionData, setDivisionData] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [sumRes, dailyRes, monthlyRes, divRes] = await Promise.all([
                api.get("/finance/reports/summary"),
                api.get("/finance/reports/daily"),
                api.get("/finance/reports/monthly"),
                api.get("/finance/reports/division")
            ]);

            setSummary(sumRes.data);
            setDailyData(dailyRes.data);
            setMonthlyData(monthlyRes.data);
            setDivisionData(divRes.data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data laporan.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

    return (
        <div className="space-y-6">
             <Breadcrumb 
                homeLink="/finance/dashboard"
                items={[
                    { label: "Dashboard", href: "/finance/dashboard" },
                    { label: "Laporan" }
                ]} 
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader 
                    title="Laporan Keuangan" 
                    description="Analisis pengeluaran perusahaan secara detail." 
                />
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="default" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100 uppercase tracking-wider">Total Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(summary.totalSpend)}</div>
                        <p className="text-xs text-blue-100 mt-1">Seumur hidup</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium text-purple-100 uppercase tracking-wider">Total Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.totalTransactions}</div>
                        <p className="text-xs text-purple-100 mt-1">Transaksi sukses</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium text-emerald-100 uppercase tracking-wider">Rata-rata / Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.totalTransactions > 0 
                                ? formatCurrency(summary.totalSpend / summary.totalTransactions) 
                                : "Rp 0"}
                        </div>
                         <p className="text-xs text-emerald-100 mt-1">Per approval</p>
                    </CardContent>
                </Card>
            </div>

            {/* Configurable Tabs */}
            <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="daily"><BarChart3 className="h-4 w-4 mr-2"/> Harian</TabsTrigger>
                    <TabsTrigger value="monthly"><Calendar className="h-4 w-4 mr-2"/> Bulanan</TabsTrigger>
                    <TabsTrigger value="division"><PieIcon className="h-4 w-4 mr-2"/> Per Divisi</TabsTrigger>
                </TabsList>

                {/* Daily Report */}
                <TabsContent value="daily" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengeluaran Harian</CardTitle>
                            <CardDescription>Tren pengeluaran berdasarkan tanggal transaksi pembayaran.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            {loading ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-slate-400"/></div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="date" 
                                            tickFormatter={(val) => format(new Date(val), "dd MMM")} 
                                        />
                                        <YAxis tickFormatter={(val) => `Rp ${val/1000}k`} />
                                        <Tooltip 
                                            formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Total"]}
                                            labelFormatter={(label) => format(new Date(label), "dd MMMM yyyy", { locale: localeId })}
                                        />
                                        <Legend />
                                        <Bar dataKey="amount" name="Total Pengeluaran" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Monthly Report */}
                <TabsContent value="monthly" className="mt-6 space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Pengeluaran Bulanan</CardTitle>
                            <CardDescription>Akumulasi pengeluaran per bulan.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                             {loading ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-slate-400"/></div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(val) => `Rp ${val/1000000}jt`} />
                                        <Tooltip formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Total"]} />
                                        <Legend />
                                        <Bar dataKey="amount" name="Total Pengeluaran" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                             )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Division Report */}
                <TabsContent value="division" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribusi per Divisi</CardTitle>
                                <CardDescription>Proporsi pengeluaran antar divisi.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px] flex justify-center">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-slate-400"/></div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={divisionData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="amount"
                                                nameKey="division"
                                            >
                                                {divisionData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Amount"]} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        {/* Summary Table for Division */}
                         <Card>
                            <CardHeader>
                                <CardTitle>Rincian Divisi</CardTitle>
                                <CardDescription>Detail angka pengeluaran per divisi.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {divisionData.map((item: any, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                                 <span className="font-medium text-slate-700">{item.division}</span>
                                            </div>
                                            <span className="font-bold text-slate-900">{formatCurrency(item.amount)}</span>
                                        </div>
                                    ))}
                                    {divisionData.length === 0 && !loading && (
                                        <p className="text-center text-slate-500 py-4">Tidak ada data.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>


        </div>
    );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, PieChart as PieIcon } from "lucide-react";
import axios from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DirectorReportExpensePage() {
    const { token } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/director/reports/expenses", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch expense reports", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [token]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Pengeluaran</h1>
                <p className="text-slate-500">Analisis distribusi pengeluaran per divisi.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieIcon className="h-5 w-5 text-indigo-500" />
                            Distribusi Pengeluaran per Divisi
                        </CardTitle>
                        <CardDescription>Persentase pengeluaran berdasarkan divisi pemohon.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.byDivision}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.byDivision.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                 <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Rincian Nominal per Divisi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.byDivision.map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="font-medium text-slate-700">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

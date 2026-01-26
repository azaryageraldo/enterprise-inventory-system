import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, TrendingUp, Package } from "lucide-react";
import axios from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DirectorReportStockPage() {
    const { token } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/director/reports/stock", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch stock reports", error);
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

    const allColumns = [
        { header: "Kode", accessor: "code" },
        { header: "Nama Barang", accessor: "name" },
        { header: "Kategori", accessor: (row: any) => row.category?.name || "-" },
        { 
            header: "Stok", 
            accessor: (row: any) => (
                <div className="flex items-center gap-2">
                    {row.stock <= row.minStock && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    <span className={row.stock <= row.minStock ? "text-amber-600 font-bold" : ""}>{row.stock}</span>
                    <span className="text-xs text-slate-500">{row.unit?.name}</span>
                </div>
            ) 
        },
        { 
            header: "Nilai Aset", 
            accessor: (row: any) => `Rp ${(row.stock * row.price).toLocaleString("id-ID")}` 
        },
    ];

    const trendingColumns = [
        { header: "Kode", accessor: "code" },
        { header: "Nama Barang", accessor: "name" },
        { header: "Sisa Stok", accessor: "stock" },
        { 
            header: "Frekuensi Keluar", 
            accessor: (row: any) => (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                    {row.frequency}x Transaksi
                </Badge>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Stok & Inventaris</h1>
                <p className="text-slate-500">Analisis pergerakan barang dan status persediaan.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600">Total Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500" />
                            <span className="text-2xl font-bold">{data.allItems.length}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-amber-50 border-amber-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-600">Perlu Restock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <span className="text-2xl font-bold">{data.lowStockItems.length}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-white border">
                    <TabsTrigger value="all">Semua Barang</TabsTrigger>
                    <TabsTrigger value="trending">Paling Sering Keluar</TabsTrigger>
                    <TabsTrigger value="lowstock">Hampir Habis ({data.lowStockItems.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Semua Barang</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={allColumns} data={data.allItems} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trending" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-500" />
                                Top 5 Barang Trending
                            </CardTitle>
                            <CardDescription>Barang dengan frekuensi transaksi keluar terbanyak.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={trendingColumns} data={data.trendingItems} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="lowstock" className="mt-4">
                     <Card className="border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-amber-700 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Stok Menipis
                            </CardTitle>
                            <CardDescription>Barang yang stoknya berada di bawah batas minimum.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={allColumns} data={data.lowStockItems} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

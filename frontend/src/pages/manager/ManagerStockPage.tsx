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
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, PackageSearch, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Item {
    id: number;
    code: string;
    name: string;
    stock: number;
    minStock: number;
    unit: { name: string };
    category: { name: string };
    price: number;
}

import { Breadcrumb } from "@/components/Breadcrumb";

export default function ManagerStockPage() {
    const [allItems, setAllItems] = useState<Item[]>([]);
    const [lowItems, setLowItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allRes, lowRes] = await Promise.all([
                    api.get("/manager/stock"),
                    api.get("/manager/stock/low")
                ]);
                setAllItems(allRes.data);
                setLowItems(lowRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const StockTable = ({ data }: { data: Item[] }) => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama Barang</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Harga Satuan</TableHead>
                        <TableHead className="text-center">Stok</TableHead>
                        <TableHead className="text-center">Min. Stok</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                                Data tidak ditemukan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono text-xs text-slate-500">{item.code}</TableCell>
                                <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                                <TableCell>{item.category?.name}</TableCell>
                                <TableCell>Rp {item.price.toLocaleString("id-ID")}</TableCell>
                                <TableCell className="text-center font-bold">{item.stock}</TableCell>
                                <TableCell className="text-center text-slate-500">{item.minStock}</TableCell>
                                <TableCell className="text-right">
                                    {item.stock <= item.minStock ? (
                                        <Badge variant="destructive" className="flex items-center w-fit ml-auto gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Kritis
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                            Aman
                                        </Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-6">
            <Breadcrumb 
                items={[{ label: "Pantau Stok" }]} 
                homeLink="/manager/dashboard" 
            />
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pantau Stok</h1>
                <p className="text-slate-500">Monitoring ketersediaan barang inventaris kantor.</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                        <PackageSearch className="w-4 h-4" />
                        Semua Barang
                    </TabsTrigger>
                    <TabsTrigger value="low" className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Stok Menipis
                        {lowItems.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                                {lowItems.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                    <StockTable data={allItems} />
                </TabsContent>
                
                <TabsContent value="low" className="mt-4">
                    <StockTable data={lowItems} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

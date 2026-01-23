import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
    Search, ArrowUpCircle, ArrowDownCircle, History, Package 
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Item {
    id: number;
    name: string;
    code: string;
    stock: number;
    unit: { name: string };
}

interface StockTransaction {
    id: number;
    type: "IN" | "OUT";
    quantity: number;
    date: string;
    notes: string;
    item: { name: string; code: string };
    user: { fullName: string };
}

export default function StockManagementPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [history, setHistory] = useState<StockTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Transaction State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<"IN" | "OUT">("IN");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [qty, setQty] = useState<number | string>("");
    const [notes, setNotes] = useState("");
    const [destination, setDestination] = useState("");

    useEffect(() => {
        fetchData();
        fetchHistory();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get("/items");
            setItems(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await api.get("/employee/stock/history");
            setHistory(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenTransaction = (item: Item, type: "IN" | "OUT") => {
        setSelectedItem(item);
        setTransactionType(type);
        setQty("");
        setNotes("");
        setDestination("");
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || !qty) return;

        try {
            const endpoint = transactionType === "IN" ? "/employee/stock/in" : "/employee/stock/out";
            const payload = {
                itemId: selectedItem.id,
                quantity: Number(qty),
                notes: notes,
                destination: transactionType === "OUT" ? destination : undefined
            };

            await api.post(endpoint, payload);
            toast.success(`Stok ${transactionType === "IN" ? "Masuk" : "Keluar"} berhasil dicatat`);
            setIsDialogOpen(false);
            fetchData();
            fetchHistory();
        } catch (error: any) {
            toast.error(error.response?.data || "Transaksi gagal");
        }
    };

    const filteredItems = items.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) || 
        i.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Breadcrumb 
                homeLink="/employee/dashboard"
                items={[
                    { label: "Dashboard", href: "/employee/dashboard" },
                    { label: "Manajemen Stok" }
                ]} 
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Manajemen Stok
                    </h1>
                    <p className="text-slate-500 mt-1">Catat barang masuk, barang keluar, dan pantau riwayat stok.</p>
                </div>
            </div>

            <Tabs defaultValue="manage" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="manage" className="gap-2"><Package className="h-4 w-4"/> Kelola Stok</TabsTrigger>
                    <TabsTrigger value="history" className="gap-2"><History className="h-4 w-4"/> Riwayat</TabsTrigger>
                </TabsList>

                {/* Manage Stock Tab */}
                <TabsContent value="manage" className="mt-6 space-y-4">
                     <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input 
                                    placeholder="Cari barang..." 
                                    className="pl-9 bg-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Kode</TableHead>
                                        <TableHead>Nama Barang</TableHead>
                                        <TableHead className="text-center">Sisa Stok</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={4} className="h-24 text-center">Memuat...</TableCell></TableRow>
                                    ) : filteredItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs text-slate-500 bg-slate-100 rounded px-2 py-1 w-fit mx-4 my-2">{item.code}</TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={`${item.stock < 10 ? "text-red-600 border-red-200 bg-red-50" : "text-slate-700"}`}>
                                                    {item.stock} {item.unit?.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleOpenTransaction(item, "IN")}>
                                                        <ArrowDownCircle className="h-4 w-4 mr-1" /> Masuk
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => handleOpenTransaction(item, "OUT")}>
                                                        <ArrowUpCircle className="h-4 w-4 mr-1" /> Keluar
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="mt-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Riwayat Transaksi</CardTitle>
                            <CardDescription>Semua catatan barang masuk dan keluar.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                             <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead>Barang</TableHead>
                                        <TableHead className="text-center">Jumlah</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        <TableHead>Oleh</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {history.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada riwayat transaksi.</TableCell></TableRow>
                                     ) : history.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="text-xs text-slate-500">
                                                {format(new Date(tx.date), "dd MMM yyyy HH:mm", { locale: localeId })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={tx.type === "IN" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}>
                                                    {tx.type === "IN" ? "Masuk" : "Keluar"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{tx.item.name}</span>
                                                    <span className="text-xs text-slate-500">{tx.item.code}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-slate-700">{tx.quantity}</TableCell>
                                            <TableCell className="text-sm text-slate-600 max-w-[200px] truncate" title={tx.notes}>{tx.notes || "-"}</TableCell>
                                            <TableCell className="text-xs text-slate-500">{tx.user?.fullName}</TableCell>
                                        </TableRow>
                                     ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Transaction Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{transactionType === "IN" ? "Catat Barang Masuk" : "Catat Barang Keluar"}</DialogTitle>
                        <DialogDescription>
                            {transactionType === "IN" 
                                ? "Menambahkan stok ke inventaris." 
                                : "Mengurangi stok dari inventaris untuk penggunaan/distribusi."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Barang</Label>
                            <Input value={`${selectedItem?.code} - ${selectedItem?.name}`} disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="qty">Jumlah ({selectedItem?.unit?.name})</Label>
                            <Input 
                                id="qty" 
                                type="number" 
                                value={qty} 
                                onChange={(e) => setQty(e.target.value)} 
                                placeholder="0" 
                                min="1" 
                                required 
                            />
                            {transactionType === "OUT" && selectedItem && (
                                <p className="text-xs text-slate-500">Stok saat ini: {selectedItem.stock}</p>
                            )}
                        </div>
                         {transactionType === "OUT" && (
                            <div className="grid gap-2">
                                <Label htmlFor="dest">Tujuan / Penerima</Label>
                                <Input 
                                    id="dest" 
                                    value={destination} 
                                    onChange={(e) => setDestination(e.target.value)} 
                                    placeholder="Contoh: Divisi IT, Ruang Rapat, Bpk. Budi" 
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Keterangan</Label>
                            <Input 
                                id="notes" 
                                value={notes} 
                                onChange={(e) => setNotes(e.target.value)} 
                                placeholder="Contoh: Pembelian baru, Penggantian rusak..." 
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                            <Button type="submit" className={transactionType === "IN" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"}>
                                {transactionType === "IN" ? "Simpan Masuk" : "Simpan Keluar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

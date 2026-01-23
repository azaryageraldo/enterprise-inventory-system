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
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, Loader2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface Item {
    id: number;
    name: string;
    code: string;
    stock: number;
    price: number;
    category: { id: number; name: string };
    unit: { id: number; name: string };
}

interface Category { id: number; name: string; }
interface Unit { id: number; name: string; }

export default function CatalogPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItemId, setCurrentItemId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        stock: "" as number | string,
        price: "" as number | string,
        categoryId: "",
        unitId: ""
    });

    useEffect(() => {
        fetchData();
        fetchMasterData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get("/items");
            setItems(response.data);
        } catch (error) {
            console.error("Failed to fetch items", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMasterData = async () => {
        try {
            const [cats, uns] = await Promise.all([
                api.get("/master-data/categories"),
                api.get("/master-data/units")
            ]);
            setCategories(cats.data);
            setUnits(uns.data);
        } catch (error) {
            console.error("Failed to fetch master data", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                code: formData.code,
                stock: Number(formData.stock),
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
                unitId: Number(formData.unitId)
            };

            if (isEditing && currentItemId) {
                await api.put(`/items/${currentItemId}`, payload);
                toast.success("Barang berhasil diperbarui");
            } else {
                await api.post("/items", payload);
                toast.success("Barang berhasil ditambahkan");
            }
            setIsDialogOpen(false);
            fetchData();
            resetForm();
        } catch (error: any) {
            toast.error(error.response?.data || "Operasi gagal");
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    const handleDelete = (item: Item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/items/${itemToDelete.id}`);
            toast.success("Barang dihapus");
            fetchData();
        } catch (error) {
            toast.error("Gagal menghapus barang");
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const openEdit = (item: Item) => {
        setFormData({
            name: item.name,
            code: item.code,
            stock: item.stock,
            price: item.price,
            categoryId: item.category?.id?.toString() || "",
            unitId: item.unit?.id?.toString() || ""
        });
        setCurrentItemId(item.id);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: "", code: "", stock: "", price: "", categoryId: "", unitId: "" });
        setIsEditing(false);
        setCurrentItemId(null);
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
                    { label: "Katalog Inventaris" }
                ]} 
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Katalog Inventaris
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola katalog produk, stok, dan harga dengan efisien.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95">
                    <Plus className="h-4 w-4 mr-2" /> Tambah Barang Baru
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardHeader className="p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Cari berdasarkan nama atau kode..." 
                            className="pl-9 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="hover:bg-slate-50">
                                <TableHead className="w-[100px] font-semibold">Kode</TableHead>
                                <TableHead className="font-semibold">Nama</TableHead>
                                <TableHead className="font-semibold">Kategori</TableHead>
                                <TableHead className="font-semibold">Unit</TableHead>
                                <TableHead className="text-right font-semibold">Harga</TableHead>
                                <TableHead className="text-center font-semibold">Stok</TableHead>
                                <TableHead className="text-right font-semibold w-[80px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <div className="flex justify-center items-center gap-2 text-slate-500">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                        Tidak ada barang ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredItems.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-medium text-slate-500 bg-slate-100/50 rounded-md px-2 py-1 w-fit mx-4 my-2">{item.code}</TableCell>
                                        <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {item.category?.name || "Tanpa Kategori"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">{item.unit?.name || "-"}</TableCell>
                                        <TableCell className="text-right font-medium text-slate-700">
                                            Rp {item.price.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                item.stock > 10 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {item.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200/50 data-[state=open]:bg-slate-200/50 rounded-lg transition-colors">
                                                        <span className="sr-only">Buka menu</span>
                                                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openEdit(item)} className="cursor-pointer">
                                                        <Pencil className="mr-2 h-3.5 w-3.5 text-slate-500" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Barang" : "Tambah Barang Baru"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">Kode</Label>
                            <Input id="code" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nama</Label>
                            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Kategori</Label>
                            <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v})}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="unit" className="text-right">Unit</Label>
                            <Select value={formData.unitId} onValueChange={v => setFormData({...formData, unitId: v})}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map(u => (
                                        <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right">Stok</Label>
                            <Input id="stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="col-span-3" required min="0" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Harga</Label>
                            <Input id="price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="col-span-3" required min="0" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Barang</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus <strong>{itemToDelete?.name}</strong>? 
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

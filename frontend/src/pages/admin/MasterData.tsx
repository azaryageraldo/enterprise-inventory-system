import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Layers, 
  Ruler, 
  Building2, 
  Wallet,
  Receipt
} from "lucide-react";
import { masterDataApi, type MasterDataItem } from "@/lib/masterDataApi";
import { toast } from "sonner";

// Reusable component for each master data type
interface MasterDataTabProps {
  title: string;
  description: string;
  data: MasterDataItem[];
  loading: boolean;
  icon: React.ReactNode;
  onAdd: () => void;
  onEdit: (item: MasterDataItem) => void;
  onDelete: (item: MasterDataItem) => void;
}

const MasterDataTable = ({ 
  title, 
  description, 
  data, 
  loading, 
  icon,
  onAdd, 
  onEdit, 
  onDelete 
}: MasterDataTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {icon}
             </div>
             <div>
                <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
             </div>
          </div>
          <Button onClick={onAdd} className="w-full sm:w-auto gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Tambah Baru
          </Button>
        </div>
        <div className="pt-4">
          <div className="relative max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder={`Cari ${title}...`}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 bg-white"
             />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead>Nama</TableHead>
                {data.some(i => i.description) && <TableHead>Deskripsi</TableHead>}
                <TableHead className="text-right w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Memuat data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    Tidak ada data ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                     <TableCell className="font-medium">{item.name}</TableCell>
                     {data.some(i => i.description) && (
                        <TableCell className="text-gray-500">{item.description || "-"}</TableCell>
                     )}
                     <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                     </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MasterData() {
  const [activeTab, setActiveTab] = useState("categories");
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [categories, setCategories] = useState<MasterDataItem[]>([]);
  const [units, setUnits] = useState<MasterDataItem[]>([]);
  const [divisions, setDivisions] = useState<MasterDataItem[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<MasterDataItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<MasterDataItem[]>([]);

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  
  // Helper to get current context based on active tab
  const getContext = () => {
    switch(activeTab) {
      case "categories": return { 
        title: "Kategori", 
        api: masterDataApi.createCategory, 
        updateApi: masterDataApi.updateCategory,
        deleteApi: masterDataApi.deleteCategory,
        refresh: fetchCategories 
      };
      case "units": return { 
        title: "Unit", 
        api: masterDataApi.createUnit, 
        updateApi: masterDataApi.updateUnit,
        deleteApi: masterDataApi.deleteUnit,
        refresh: fetchUnits 
      };
      case "divisions": return { 
        title: "Divisi", 
        api: masterDataApi.createDivision, 
        updateApi: masterDataApi.updateDivision,
        deleteApi: masterDataApi.deleteDivision,
        refresh: fetchDivisions 
      };
      case "expense-categories": return { 
        title: "Kategori Pengeluaran", 
        api: masterDataApi.createExpenseCategory, 
        updateApi: masterDataApi.updateExpenseCategory,
        deleteApi: masterDataApi.deleteExpenseCategory,
        refresh: fetchExpenseCategories 
      };
      case "payment-methods": return { 
        title: "Metode Pembayaran", 
        api: masterDataApi.createPaymentMethod, 
        updateApi: masterDataApi.updatePaymentMethod,
        deleteApi: masterDataApi.deletePaymentMethod,
        refresh: fetchPaymentMethods 
      };
      default: return null;
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchCategories();
    fetchUnits();
    fetchDivisions();
    fetchExpenseCategories();
    fetchPaymentMethods();
  };

  const fetchCategories = async () => {
    try {
      const data = await masterDataApi.getCategories();
      setCategories(data);
    } catch (e) { console.error(e); }
  };
  const fetchUnits = async () => {
    try {
      const data = await masterDataApi.getUnits();
      setUnits(data);
    } catch (e) { console.error(e); }
  };
  const fetchDivisions = async () => {
    try {
      const data = await masterDataApi.getDivisions();
      setDivisions(data);
    } catch (e) { console.error(e); }
  };
  const fetchExpenseCategories = async () => {
    try {
      const data = await masterDataApi.getExpenseCategories();
      setExpenseCategories(data);
    } catch (e) { console.error(e); }
  };
  const fetchPaymentMethods = async () => {
    try {
      const data = await masterDataApi.getPaymentMethods();
      setPaymentMethods(data);
    } catch (e) { console.error(e); }
  };

  const handleOpenDialog = (item?: MasterDataItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description || "" });
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "" });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const ctx = getContext();
    if (!ctx) return;

    try {
      setLoading(true);
      if (editingItem) {
        await ctx.updateApi(editingItem.id, formData);
        toast.success(`${ctx.title} updated successfully`);
      } else {
        await ctx.api(formData);
        toast.success(`${ctx.title} created successfully`);
      }
      setDialogOpen(false);
      ctx.refresh();
    } catch (error) {
      toast.error(`Failed to save ${ctx.title}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const ctx = getContext();
    if (!ctx || !editingItem) return;

    try {
      setLoading(true);
      await ctx.deleteApi(editingItem.id);
      toast.success(`${ctx.title} deleted successfully`);
      setDeleteDialogOpen(false);
      ctx.refresh();
    } catch (error) {
      toast.error(`Failed to delete ${ctx.title}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <Breadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Data Master" }]} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data Master</h1>
          <p className="text-muted-foreground mt-1">
            Kelola Kategori, Unit, Divisi, dan data referensi sistem lainnya.
          </p>
        </div>
      </div>

      <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-gray-100 rounded-lg">
          <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Layers className="mr-2 h-4 w-4" /> Kategori
          </TabsTrigger>
          <TabsTrigger value="expense-categories" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Receipt className="mr-2 h-4 w-4" /> Pengeluaran
          </TabsTrigger>
          <TabsTrigger value="units" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Ruler className="mr-2 h-4 w-4" /> Unit
          </TabsTrigger>
          <TabsTrigger value="divisions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Building2 className="mr-2 h-4 w-4" /> Divisi
          </TabsTrigger>
          <TabsTrigger value="payment-methods" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Wallet className="mr-2 h-4 w-4" /> Pembayaran
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="categories" className="mt-0">
             <MasterDataTable 
               title="Kategori Barang" 
               description="Kelola kategori barang untuk klasifikasi inventaris."
               data={categories} 
               loading={loading}
               icon={<Layers className="h-6 w-6 text-primary" />}
               onAdd={() => handleOpenDialog()}
               onEdit={handleOpenDialog}
               onDelete={(item) => { setEditingItem(item); setDeleteDialogOpen(true); }}
             />
          </TabsContent>
          <TabsContent value="expense-categories" className="mt-0">
             <MasterDataTable 
               title="Kategori Pengeluaran" 
               description="Kelola jenis pengeluaran untuk laporan keuangan."
               data={expenseCategories} 
               loading={loading}
               icon={<Receipt className="h-6 w-6 text-primary" />}
               onAdd={() => handleOpenDialog()}
               onEdit={handleOpenDialog}
               onDelete={(item) => { setEditingItem(item); setDeleteDialogOpen(true); }}
             />
          </TabsContent>
          <TabsContent value="units" className="mt-0">
             <MasterDataTable 
               title="Unit (Satuan)" 
               description="Kelola satuan ukuran barang (Pcs, Kg, Box, dll)."
               data={units} 
               loading={loading}
               icon={<Ruler className="h-6 w-6 text-primary" />}
               onAdd={() => handleOpenDialog()}
               onEdit={handleOpenDialog}
               onDelete={(item) => { setEditingItem(item); setDeleteDialogOpen(true); }}
             />
          </TabsContent>
          <TabsContent value="divisions" className="mt-0">
             <MasterDataTable 
               title="Divisi" 
               description="Kelola divisi atau departemen organisasi."
               data={divisions} 
               loading={loading}
               icon={<Building2 className="h-6 w-6 text-primary" />}
               onAdd={() => handleOpenDialog()}
               onEdit={handleOpenDialog}
               onDelete={(item) => { setEditingItem(item); setDeleteDialogOpen(true); }}
             />
          </TabsContent>
          <TabsContent value="payment-methods" className="mt-0">
             <MasterDataTable 
               title="Metode Pembayaran" 
               description="Kelola metode pembayaran yang diterima untuk transaksi."
               data={paymentMethods} 
               loading={loading}
               icon={<Wallet className="h-6 w-6 text-primary" />}
               onAdd={() => handleOpenDialog()}
               onEdit={handleOpenDialog}
               onDelete={(item) => { setEditingItem(item); setDeleteDialogOpen(true); }}
             />
          </TabsContent>
        </div>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${getContext()?.title}` : `Tambah ${getContext()?.title} Baru`}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Perbarui detail item ini." : "Buat entri baru di data master."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama"
              />
            </div>
            {(activeTab === "expense-categories" || activeTab === "payment-methods") && (
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan deskripsi"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Item</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{editingItem?.name}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

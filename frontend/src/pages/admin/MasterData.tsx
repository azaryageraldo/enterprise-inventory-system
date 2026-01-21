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
            Add New
          </Button>
        </div>
        <div className="pt-4">
          <div className="relative max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder={`Search ${title}...`}
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
                <TableHead>Name</TableHead>
                {data.some(i => i.description) && <TableHead>Description</TableHead>}
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Loading data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No data found.
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
        title: "Category", 
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
        title: "Division", 
        api: masterDataApi.createDivision, 
        updateApi: masterDataApi.updateDivision,
        deleteApi: masterDataApi.deleteDivision,
        refresh: fetchDivisions 
      };
      case "expense-categories": return { 
        title: "Expense Category", 
        api: masterDataApi.createExpenseCategory, 
        updateApi: masterDataApi.updateExpenseCategory,
        deleteApi: masterDataApi.deleteExpenseCategory,
        refresh: fetchExpenseCategories 
      };
      case "payment-methods": return { 
        title: "Payment Method", 
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
      <Breadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Master Data" }]} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Master Data</h1>
          <p className="text-muted-foreground mt-1">
            Manage Categories, Units, Divisions, and other system reference data.
          </p>
        </div>
      </div>

      <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-gray-100 rounded-lg">
          <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Layers className="mr-2 h-4 w-4" /> Categories
          </TabsTrigger>
          <TabsTrigger value="expense-categories" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Receipt className="mr-2 h-4 w-4" /> Expenses
          </TabsTrigger>
          <TabsTrigger value="units" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Ruler className="mr-2 h-4 w-4" /> Units
          </TabsTrigger>
          <TabsTrigger value="divisions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Building2 className="mr-2 h-4 w-4" /> Divisions
          </TabsTrigger>
          <TabsTrigger value="payment-methods" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
             <Wallet className="mr-2 h-4 w-4" /> Payment
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="categories" className="mt-0">
             <MasterDataTable 
               title="Item Categories" 
               description="Manage item categories for inventory classification."
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
               title="Expense Categories" 
               description="Manage types of expenses for financial reporting."
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
               title="Units (Satuan)" 
               description="Manage measurement units for items (Pcs, Kg, Box, etc)."
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
               title="Divisions" 
               description="Manage organizational divisions or departments."
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
               title="Payment Methods" 
               description="Manage accepted payment methods for transactions."
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
            <DialogTitle>{editingItem ? `Edit ${getContext()?.title}` : `Add New ${getContext()?.title}`}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the details of this item." : "Create a new entry in master data."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            {(activeTab === "expense-categories" || activeTab === "payment-methods") && (
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{editingItem?.name}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

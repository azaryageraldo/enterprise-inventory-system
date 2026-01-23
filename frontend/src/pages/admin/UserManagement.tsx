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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Key,
  UserPlus,
  Filter,
  Download,
  Users
} from "lucide-react";
import { userApi, type UserResponse, type UserRequest, type Division } from "@/lib/userApi";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form states
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [formData, setFormData] = useState<UserRequest>({
    username: "",
    password: "",
    fullName: "",
    role: "PEGAWAI",
    divisionId: null,
  });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchDivisions();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const data = await userApi.getDivisions();
      setDivisions(data);
    } catch (error) {
      toast.error("Gagal memuat divisi");
    }
  };

  const handleOpenUserDialog = (user?: UserResponse) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "",
        fullName: user.fullName,
        role: user.role,
        divisionId: user.divisionId,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        fullName: "",
        role: "PEGAWAI",
        divisionId: null,
      });
    }
    setUserDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await userApi.updateUser(editingUser.id, formData);
        toast.success("Pengguna berhasil diperbarui");
      } else {
        await userApi.createUser(formData);
        toast.success("Pengguna berhasil dibuat");
      }
      setUserDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan pengguna");
    }
  };

  const handleDeleteUser = async () => {
    if (!editingUser) return;
    try {
      await userApi.deleteUser(editingUser.id);
      toast.success("Pengguna berhasil dihapus");
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Gagal menghapus pengguna");
    }
  };

  const handleResetPassword = async () => {
    if (!editingUser) return;
    try {
      await userApi.resetPassword(editingUser.id, newPassword);
      toast.success("Password berhasil direset");
      setPasswordDialogOpen(false);
      setNewPassword("");
    } catch (error) {
      toast.error("Gagal mereset password");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case "ADMIN": return "destructive";
      case "PIMPINAN": return "default"; // Navy/Primary
      case "KEUANGAN": return "default"; // Greenish if custom, else default
      case "ATASAN": return "secondary";
      default: return "outline";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6 w-full">
      <Breadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Manajemen Pengguna" }]} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Pengguna</h1>
          <p className="text-muted-foreground mt-1">
            Kelola pengguna sistem, peran, dan perizinan dalam organisasi Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="hidden sm:flex" disabled>
             <Download className="mr-2 h-4 w-4" />
             Ekspor
           </Button>
           <Button onClick={() => handleOpenUserDialog()} className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah Pengguna Baru
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full sm:w-auto relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan nama atau username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="h-9 hidden sm:flex">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead className="w-[150px]">Username</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                         <p>Memuat data pengguna...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                         <Users className="h-10 w-10 text-gray-300" />
                         <p>Tidak ada pengguna ditemukan.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} />
                            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-700">{user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="shadow-sm">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                            {user.divisionName ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">
                                    {user.divisionName}
                                </span>
                            ) : (
                                <span className="text-gray-400 italic">Tanpa Divisi</span>
                            )}
                         </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-colors">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenUserDialog(user)} className="cursor-pointer">
                               <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setEditingUser(user); setPasswordDialogOpen(true); }} className="cursor-pointer">
                               <Key className="mr-2 h-4 w-4" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => { setEditingUser(user); setDeleteDialogOpen(true); }} 
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                               <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Perbarui akses dan informasi pengguna" : "Buat akun pengguna baru dengan akses berbasis peran."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="cth: budi.santoso"
                className="col-span-3"
              />
            </div>
            {!editingUser && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="cth: Budi Santoso"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="role">Peran</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="PEGAWAI">Pegawai</SelectItem>
                    <SelectItem value="ATASAN">Atasan</SelectItem>
                    <SelectItem value="KEUANGAN">Keuangan</SelectItem>
                    <SelectItem value="PIMPINAN">Pimpinan</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="grid gap-2">
                <Label htmlFor="division">Divisi</Label>
                <Select
                    value={formData.divisionId?.toString() || "none"}
                    onValueChange={(value) =>
                    setFormData({ ...formData, divisionId: value === "none" ? null : parseInt(value) })
                    }
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Pilih divisi" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="none">Tanpa Divisi</SelectItem>
                    {divisions.map((div) => (
                        <SelectItem key={div.id} value={div.id.toString()}>
                        {div.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveUser}>
                {editingUser ? "Simpan Perubahan" : "Buat Pengguna"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Buat password baru yang aman untuk <strong>{editingUser?.fullName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Akun Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{editingUser?.fullName}</strong> secara permanen? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Hapus Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

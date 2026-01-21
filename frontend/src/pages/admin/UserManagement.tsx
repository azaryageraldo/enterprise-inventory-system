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
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const data = await userApi.getDivisions();
      setDivisions(data);
    } catch (error) {
      toast.error("Failed to fetch divisions");
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
        toast.success("User updated successfully");
      } else {
        await userApi.createUser(formData);
        toast.success("User created successfully");
      }
      setUserDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save user");
    }
  };

  const handleDeleteUser = async () => {
    if (!editingUser) return;
    try {
      await userApi.deleteUser(editingUser.id);
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleResetPassword = async () => {
    if (!editingUser) return;
    try {
      await userApi.resetPassword(editingUser.id, newPassword);
      toast.success("Password reset successfully");
      setPasswordDialogOpen(false);
      setNewPassword("");
    } catch (error) {
      toast.error("Failed to reset password");
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
      <Breadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "User Management" }]} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage system users, roles, and permissions within your organization.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="hidden sm:flex" disabled>
             <Download className="mr-2 h-4 w-4" />
             Export
           </Button>
           <Button onClick={() => handleOpenUserDialog()} className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full sm:w-auto relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or username..."
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
                  <TableHead>Full Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                         <p>Loading user data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                         <Users className="h-10 w-10 text-gray-300" />
                         <p>No users found matching your search.</p>
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
                                <span className="text-gray-400 italic">No Division</span>
                            )}
                         </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-colors">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                               <Trash2 className="mr-2 h-4 w-4" /> Delete
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
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update system access and information" : "Create a new user account with role-based access."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g., john.doe"
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
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
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
                <Label htmlFor="division">Division</Label>
                <Select
                    value={formData.divisionId?.toString() || "none"}
                    onValueChange={(value) =>
                    setFormData({ ...formData, divisionId: value === "none" ? null : parseInt(value) })
                    }
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="none">No Division</SelectItem>
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
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
                {editingUser ? "Save Changes" : "Create User"}
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
              Create a new secure password for <strong>{editingUser?.fullName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong>{editingUser?.fullName}</strong>? 
              This action cannot be undone and will remove all access for this user.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

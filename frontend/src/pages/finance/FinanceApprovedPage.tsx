import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { PaymentDialog } from "@/components/finance/PaymentDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Loader2, RefreshCw } from "lucide-react";
import axios from "@/lib/api";
import { cn } from "@/lib/utils";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function FinanceApprovedPage() {
    const { token } = useAuthStore();
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/finance/payments/approved", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(response.data);
        } catch (error) {
            console.error("Failed to fetch approved expenses", error);
            toast.error("Gagal memuat daftar pengajuan.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [token]);

    const handlePayment = (expense: any) => {
        setSelectedExpense(expense);
        setDialogOpen(true);
    };

    const confirmPayment = async (data: any) => {
        try {
            await axios.post("/finance/payments/process", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Pembayaran berhasil diproses.");
            fetchExpenses(); // Refresh list
        } catch (error) {
            console.error("Payment processing failed", error);
            toast.error("Gagal memproses pembayaran.");
            throw error; // Re-throw to handle loading state in dialog
        }
    };

    const columns = [
        {
            header: "Diajukan Oleh",
            accessor: (row: any) => row.user?.fullName || "-",
        },
        {
            header: "Tujuan",
            accessor: "purpose",
        },
        {
            header: "Jumlah",
            accessor: (row: any) => `Rp ${row.amount?.toLocaleString("id-ID")}`,
        },
        {
            header: "Tanggal Approval",
            accessor: (row: any) => row.approvalDate ? format(new Date(row.approvalDate), "dd MMM yyyy", { locale: localeId }) : "-",
        },
        {
            header: "Status",
            accessor: (row: any) => (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                    {row.status}
                </Badge>
            ),
        },
        {
            header: "Aksi",
            accessor: (row: any) => (
                <Button 
                    size="sm" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => handlePayment(row)}
                >
                    Proses Pembayaran
                </Button>
            ),
        }
    ];

    return (
        <div className="space-y-6">
            <Breadcrumb 
                homeLink="/finance/dashboard"
                items={[
                    { label: "Dashboard", href: "/finance/dashboard" },
                    { label: "Perlu Pembayaran" }
                ]} 
            />
            <div className="flex justify-between items-center">
                <PageHeader 
                    title="Perlu Pembayaran" 
                    description="Daftar pengajuan pengeluaran yang telah disetujui atasan dan menunggu pembayaran." 
                />
                <Button variant="outline" size="icon" onClick={fetchExpenses} disabled={isLoading}>
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Daftar Tagihan</CardTitle>
                    <CardDescription>
                        {expenses.length} pengajuan menunggu pembayaran.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex justify-center py-8 text-slate-500">
                            <Loader2 className="h-8 w-8 animate-spin" />
                         </div>
                    ) : (
                        <DataTable columns={columns} data={expenses} />
                    )}
                </CardContent>
            </Card>

            <PaymentDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                expense={selectedExpense}
                onConfirm={confirmPayment}
            />
        </div>
    );
}



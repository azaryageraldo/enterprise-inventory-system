import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Loader2, RefreshCw, ExternalLink } from "lucide-react";
import axios from "@/lib/api";
import { cn } from "@/lib/utils";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function FinanceTransactionPage() {
    const { token } = useAuthStore();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/finance/payments/history", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error("Failed to fetch transaction history", error);
            toast.error("Gagal memuat riwayat transaksi.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [token]);

    const columns = [
        {
            header: "No. Transaksi",
            accessor: (row: any) => row.transactionNumber,
        },
        {
            header: "Tanggal Bayar",
            accessor: (row: any) => row.paymentDate ? format(new Date(row.paymentDate), "dd MMM yyyy", { locale: localeId }) : "-",
        },
        {
            header: "Pengajuan",
            accessor: (row: any) => row.expenseRequest?.purpose || "-",
        },
        {
            header: "Metode",
            accessor: (row: any) => row.paymentMethod,
        },
        {
            header: "Jumlah",
            accessor: (row: any) => `Rp ${row.amount?.toLocaleString("id-ID")}`,
        },
        {
            header: "Bukti",
            accessor: (row: any) => row.paymentProof ? (
                <a href={row.paymentProof} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                    Lihat <ExternalLink className="h-3 w-3" />
                </a>
            ) : "-",
        }
    ];

    return (
        <div className="space-y-6">
            <Breadcrumb 
                homeLink="/finance/dashboard"
                items={[
                    { label: "Dashboard", href: "/finance/dashboard" },
                    { label: "Riwayat Transaksi" }
                ]} 
            />
            <div className="flex justify-between items-center">
                <PageHeader 
                    title="Riwayat Transaksi" 
                    description="Buku kas yang mencatat semua pengeluaran yang telah dibayarkan." 
                />
                <Button variant="outline" size="icon" onClick={fetchTransactions} disabled={isLoading}>
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Buku Kas Pengeluaran</CardTitle>
                    <CardDescription>
                        Total {transactions.length} transaksi tercatat.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex justify-center py-8 text-slate-500">
                            <Loader2 className="h-8 w-8 animate-spin" />
                         </div>
                    ) : (
                        <DataTable columns={columns} data={transactions} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}



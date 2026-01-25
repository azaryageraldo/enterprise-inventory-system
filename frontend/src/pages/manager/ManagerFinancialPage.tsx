import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Loader2, RefreshCw, ExternalLink } from "lucide-react";
import axios from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ManagerFinancialPage() {
    const { token } = useAuthStore();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            // Using the Manager endpoint we just added
            const response = await axios.get("/manager/expenses/history", {
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
            header: "Pengaju",
            accessor: (row: any) => row.expenseRequest?.user?.fullName || "-",
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
                homeLink="/manager/dashboard"
                items={[
                    { label: "Dashboard", href: "/manager/dashboard" },
                    { label: "Keuangan" }
                ]} 
            />
            <div className="flex justify-between items-center">
                <PageHeader 
                    title="Monitoring Pembayaran" 
                    description="Pantau riwayat pencairan dana yang dilakukan oleh Tim Keuangan." 
                />
                <Button variant="outline" size="icon" onClick={fetchTransactions} disabled={isLoading}>
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Riwayat Transaksi Keuangan</CardTitle>
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

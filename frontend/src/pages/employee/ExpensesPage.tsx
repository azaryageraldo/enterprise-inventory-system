import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
    Wallet, Plus, History, Loader2, CheckCircle2, XCircle, Clock, Banknote 
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface ExpenseRequest {
    id: number;
    amount: number;
    purpose: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
    requestDate: string;
    rejectionNote?: string;
    evidenceImage?: string;
}

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<ExpenseRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Form State
    const [amount, setAmount] = useState("");
    const [purpose, setPurpose] = useState("");
    const [evidenceType, setEvidenceType] = useState<"LINK" | "FILE">("LINK");
    const [evidenceLink, setEvidenceLink] = useState("");
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await api.get("/employee/expenses");
            setExpenses(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("purpose", purpose);
            formData.append("evidenceType", evidenceType);
            
            if (evidenceType === "LINK") {
                formData.append("evidenceLink", evidenceLink);
            } else if (evidenceFile) {
                formData.append("evidenceFile", evidenceFile);
            }

            await api.post("/employee/expenses", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            toast.success("Pengajuan berhasil dikirim");
            setAmount("");
            setPurpose("");
            setEvidenceLink("");
            setEvidenceFile(null);
            setEvidenceType("LINK");
            fetchExpenses();
        } catch (error: any) {
            toast.error(`Gagal mengirim pengajuan (${error.response?.status || 'Net'}): ` + (error.response?.data || "Error jaringan"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1"/> Menunggu</Badge>;
            case "APPROVED": return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Disetujui</Badge>;
            case "REJECTED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1"/> Ditolak</Badge>;
            case "PAID": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Banknote className="w-3 h-3 mr-1"/> Dibayar</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const renderEvidence = (exp: ExpenseRequest) => { // Using explicit type locally if needed or infer
        if (!exp.evidenceImage) return <span className="text-slate-400">-</span>;
        
        // We assume backend returns full path for FILE or just URL for LINK
        // But for FILE we need to prepend base URL if it's a relative path name
        const isFile = !exp.evidenceImage.startsWith("http"); // Simple heuristic or use exp.evidenceType if available
        const url = isFile ? `http://localhost:8080/uploads/${exp.evidenceImage}` : exp.evidenceImage;

        return (
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-600 underline flex items-center gap-1"
            >
                {isFile ? (
                    exp.evidenceImage.match(/\.(jpeg|jpg|png|gif)$/i) ? "Lihat Foto" : "Unduh File"
                ) : "Buka Link"}
            </a>
        );
    };

    return (
        <div className="space-y-6">
            <Breadcrumb 
                homeLink="/employee/dashboard"
                items={[
                    { label: "Dashboard", href: "/employee/dashboard" },
                    { label: "Keuangan" }
                ]} 
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Pengajuan Pengeluaran
                    </h1>
                    <p className="text-slate-500 mt-1">Ajukan klaim pengeluaran operasional dan pantau statusnya.</p>
                </div>
            </div>

            <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="list" className="gap-2"><History className="h-4 w-4"/> Riwayat Pengajuan</TabsTrigger>
                    <TabsTrigger value="new" className="gap-2"><Plus className="h-4 w-4"/> Ajukan Baru</TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="mt-6">
                     <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Riwayat Klaim</CardTitle>
                            <CardDescription>Daftar semua pengajuan pengeluaran Anda.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Tujuan</TableHead>
                                        <TableHead>Bukti</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead>Catatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={6} className="h-24 text-center">Memuat...</TableCell></TableRow>
                                    ) : expenses.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada pengajuan.</TableCell></TableRow>
                                    ) : expenses.map((exp) => (
                                        <TableRow key={exp.id}>
                                            <TableCell className="text-xs text-slate-500">
                                                {format(new Date(exp.requestDate), "dd MMM yyyy", { locale: localeId })}
                                            </TableCell>
                                            <TableCell className="font-medium">{exp.purpose}</TableCell>
                                            <TableCell>
                                                {renderEvidence(exp)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                Rp {exp.amount.toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStatusBadge(exp.status)}
                                            </TableCell>
                                            <TableCell className="text-xs text-red-500">
                                                {exp.rejectionNote || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* New Request Tab */}
                <TabsContent value="new" className="mt-6 max-w-2xl">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Formulir Pengajuan</CardTitle>
                            <CardDescription>Isi detail pengeluaran yang ingin diklaim.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Jumlah Biaya (Rp)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500 font-medium">Rp</span>
                                        <Input 
                                            id="amount" 
                                            type="number" 
                                            min="0"
                                            className="pl-9"
                                            placeholder="0" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="purpose">Tujuan Pengeluaran</Label>
                                    <Textarea 
                                        id="purpose" 
                                        placeholder="Jelaskan kebutuhan pengeluaran ini..." 
                                        className="resize-none"
                                        rows={3}
                                        value={purpose}
                                        onChange={(e) => setPurpose(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Bukti Lampiran</Label>
                                    <div className="flex gap-4 mb-2">
                                        <Button 
                                            type="button" 
                                            variant={evidenceType === "LINK" ? "default" : "outline"} 
                                            onClick={() => setEvidenceType("LINK")}
                                            className="flex-1"
                                        >
                                            Link / URL
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant={evidenceType === "FILE" ? "default" : "outline"} 
                                            onClick={() => setEvidenceType("FILE")}
                                            className="flex-1"
                                        >
                                            Upload File
                                        </Button>
                                    </div>

                                    {evidenceType === "LINK" ? (
                                        <Input 
                                            placeholder="https://..." 
                                            value={evidenceLink}
                                            onChange={(e) => setEvidenceLink(e.target.value)}
                                        />
                                    ) : (
                                        <Input 
                                            type="file" 
                                            accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                            onChange={(e) => setEvidenceFile(e.target.files ? e.target.files[0] : null)}
                                        />
                                    )}
                                    <p className="text-xs text-slate-500">
                                        {evidenceType === "LINK" 
                                            ? "Masukkan link Google Drive atau penyimpanan cloud lainnya." 
                                            : "Upload foto (JPG, PNG), PDF, atau Excel. Maks 5MB."}
                                    </p>
                                </div>

                                <div className="pt-4">
                                                                   <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Wallet className="mr-2 h-4 w-4" /> Ajukan Pengeluaran
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

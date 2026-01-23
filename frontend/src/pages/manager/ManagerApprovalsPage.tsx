import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ExpenseRequest {
    id: number;
    amount: number;
    purpose: string;
    description: string;
    requestDate: string;
    user: { fullName: string; division: { name: string } };
    status: string;
    evidenceImage: string | null;
}

export default function ManagerApprovalsPage() {
    const [requests, setRequests] = useState<ExpenseRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchRequests = async () => {
        try {
            const response = await api.get("/manager/expenses/pending");
            setRequests(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data pengajuan");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            setIsProcessing(true);
            await api.put(`/manager/expenses/${id}/approve`);
            toast.success("Pengajuan berhasil disetujui");
            fetchRequests();
        } catch (error) {
            toast.error("Gagal menyetujui pengajuan");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedId) return;
        try {
            setIsProcessing(true);
            await api.put(`/manager/expenses/${selectedId}/reject`, { reason: rejectReason });
            toast.success("Pengajuan ditolak");
            setRejectDialogOpen(false);
            setRejectReason("");
            fetchRequests();
        } catch (error) {
            toast.error("Gagal menolak pengajuan");
        } finally {
            setIsProcessing(false);
        }
    };

    const openRejectDialog = (id: number) => {
        setSelectedId(id);
        setRejectDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Persetujuan Pengeluaran</h1>
                <p className="text-slate-500">Tinjau dan kelola pengajuan pengeluaran dari pegawai.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Pegawai</TableHead>
                            <TableHead>Divisi</TableHead>
                            <TableHead>Keperluan</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Bukti</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                                    Tidak ada pengajuan pending saat ini.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(req.requestDate), "d MMM yyyy", { locale: localeId })}
                                    </TableCell>
                                    <TableCell>{req.user.fullName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal bg-slate-50">
                                            {req.user.division?.name || "Umum"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <div className="font-medium text-slate-900">{req.purpose}</div>
                                        <div className="text-xs text-slate-500 truncate">{req.description}</div>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-700">
                                        Rp {req.amount.toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell>
                                        {req.evidenceImage ? (
                                            <a 
                                                href={req.evidenceImage.startsWith('http') ? req.evidenceImage : `http://localhost:8080${req.evidenceImage}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="inline-flex items-center text-xs text-indigo-600 hover:underline"
                                            >
                                                <FileText className="w-3 h-3 mr-1" />
                                                Lihat
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                            onClick={() => openRejectDialog(req.id)}
                                            disabled={isProcessing}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Tolak
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => handleApprove(req.id)}
                                            disabled={isProcessing}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Setujui
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Pengajuan</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan untuk pengajuan ini agar pegawai dapat memperbaikinya.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea 
                        placeholder="Contoh: Bukti pembayaran tidak jelas, mohon upload ulang."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Batal</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleReject}
                            disabled={!rejectReason.trim() || isProcessing}
                        >
                            Konfirmasi Tolak
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Banknote, FileText, ExternalLink } from "lucide-react";

interface DetailExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: any; // Contains { expense, paymentDate, transactionNumber, etc }
}

export function DetailExpenseDialog({ open, onOpenChange, data }: DetailExpenseDialogProps) {
    if (!data || !data.expense) return null;
    const { expense, paymentDate, transactionNumber, paymentProof, paymentMethod } = data;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1"/> Menunggu</Badge>;
            case "APPROVED": return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Disetujui</Badge>;
            case "REJECTED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1"/> Ditolak</Badge>;
            case "PAID": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Banknote className="w-3 h-3 mr-1"/> Dibayar</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detail Pengajuan</DialogTitle>
                    <DialogDescription>ID: #{expense.id} • Dibuat pada {format(new Date(expense.requestDate), "dd MMM yyyy HH:mm", { locale: localeId })}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2 text-sm">
                    {/* Status Section */}
                    <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Status Pengajuan</span>
                        {getStatusBadge(expense.status)}
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-3 border-b pb-4">
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">Tujuan</span>
                            <span className="col-span-2 font-medium">{expense.purpose}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-slate-500">Jumlah</span>
                            <span className="col-span-2 font-bold text-lg">Rp {expense.amount.toLocaleString("id-ID")}</span>
                        </div>
                         {/* Approver Info if Approved */}
                         {expense.approvalDate && (
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Disetujui Pada</span>
                                <span className="col-span-2 text-emerald-700 font-medium">
                                    {format(new Date(expense.approvalDate), "dd MMM yyyy HH:mm", { locale: localeId })}
                                </span>
                            </div>
                        )}
                        {/* Rejection Note */}
                        {expense.rejectionReason && (
                             <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Alasan Tolak</span>
                                <span className="col-span-2 text-red-600 font-medium">{expense.rejectionReason}</span>
                            </div>
                        )}
                    </div>

                    {/* Payment Info */}
                    {transactionNumber && (
                        <div className="space-y-3 pt-2">
                            <h4 className="font-semibold flex items-center gap-2"><Banknote className="w-4 h-4"/> Informasi Pembayaran</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">No. Transaksi</span>
                                <span className="col-span-2 font-mono bg-slate-100 px-1 rounded w-fit">{transactionNumber}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Dibayar Pada</span>
                                <span className="col-span-2 font-medium">
                                    {paymentDate ? format(new Date(paymentDate), "dd MMM yyyy", { locale: localeId }) : "-"}
                                </span>
                            </div>
                             <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Metode</span>
                                <span className="col-span-2">{paymentMethod}</span>
                            </div>
                            {paymentProof && (
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-slate-500">Bukti Bayar</span>
                                    <span className="col-span-2">
                                        <a href={paymentProof} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1 hover:text-blue-800">
                                            <ExternalLink className="w-3 h-3"/> Lihat Bukti
                                        </a>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { id as localeId } from "date-fns/locale";

interface PaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expense: any; // Using any for simplicity in props, but prefer typed interface
    onConfirm: (data: any) => Promise<void>;
}

export function PaymentDialog({ open, onOpenChange, expense, onConfirm }: PaymentDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [transactionNumber, setTransactionNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
    const [proofFile, setProofFile] = useState<File | null>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0]);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentDate || !paymentMethod || !transactionNumber) return;
        
        setIsLoading(true);
        try {
            let proofBase64 = "";
            if (proofFile) {
                proofBase64 = await convertToBase64(proofFile);
            }

            await onConfirm({
                expenseId: expense.id,
                transactionNumber,
                paymentMethod,
                paymentDate: paymentDate.toISOString(),
                amount: expense.amount,
                proofImage: proofBase64
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!expense) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Proses Pembayaran</DialogTitle>
                    <DialogDescription>
                        Lengkapi detail pembayaran untuk pengajuan <b>{expense.purpose}</b> sebesar <b>Rp {expense.amount?.toLocaleString("id-ID")}</b>.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="method">Metode Pembayaran</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih metode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                                <SelectItem value="Tunai">Tunai</SelectItem>
                                <SelectItem value="Cek">Cek</SelectItem>
                                <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Tanggal Pembayaran</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !paymentDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {paymentDate ? format(paymentDate, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={paymentDate}
                                    onSelect={setPaymentDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="trx">Nomor Transaksi / Ref</Label>
                        <Input 
                            id="trx" 
                            placeholder="Contoh: TRX-2024-001" 
                            value={transactionNumber}
                            onChange={(e) => setTransactionNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                       <Label>Bukti Pembayaran (File Foto/PDF)</Label>
                       <Input 
                           type="file"
                           accept="image/*,application/pdf"
                           onChange={handleFileChange}
                           className="cursor-pointer"
                        />
                        <p className="text-[10px] text-muted-foreground">Upload bukti transfer atau kuitansi.</p>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading || !paymentDate || !paymentMethod || !transactionNumber}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Konfirmasi Pembayaran"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

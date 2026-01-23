package com.inventory.system.payload.response;

import com.inventory.system.model.ExpenseRequest;
import com.inventory.system.model.StockTransaction;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class EmployeeDashboardStats {
    private long totalRequests; // Stock Requests? Or Expenses? Let's assume Stock for "Permintaan Saya" based
                                // on UI icon Package
    // Wait, the UI says "Permintaan Saya" (Total barang diminta) -> Package Icon.
    // This implies Stock Requests (My Stock Transactions).

    // Actually "Permintaan Saya" in UI meant "My Requests" (Stock).
    // "Menunggu Persetujuan" -> Usually Expenses? Or Stock if approval needed. UI
    // Context implies Expenses wait approval?
    // In our system Stock is instant (Log), but Expense has Status.
    // Let's map:
    // 1. My Stock Transactions Count (or Items taken).
    // 2. Pending Expenses.
    // 3. Approved Expenses Sum.

    // Let's refine based on UI:
    // - "Permintaan Saya" (Total barang diminta) -> Count of Stock Transactions
    // (Type OUT)? Or just count of transactions.
    // - "Menunggu Persetujuan" -> Count of Pending Expenses.
    // - "Pengeluaran Disetujui" -> Sum of Approved Expenses.

    private long totalStockTransactions;
    private long pendingExpenses;
    private BigDecimal approvedExpensesSum;

    private List<ExpenseRequest> recentExpenses;
    private List<StockTransaction> recentStockTransactions;
}

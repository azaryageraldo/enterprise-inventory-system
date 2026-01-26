package com.inventory.system.controller.director;

import com.inventory.system.model.ExpenseStatus;
import com.inventory.system.model.FinancialRecord;
import com.inventory.system.repository.ExpenseRequestRepository;
import com.inventory.system.repository.FinancialRecordRepository;
import com.inventory.system.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/director")
@RequiredArgsConstructor
public class DirectorController {

    private final FinancialRecordRepository financialRecordRepository;
    private final ExpenseRequestRepository expenseRequestRepository;
    private final ItemRepository itemRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            System.out.println("DEBUG: Fetching Director Dashboard Stats...");
            LocalDateTime startOfMonth = YearMonth.now().atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = YearMonth.now().atEndOfMonth().atTime(23, 59, 59);

            // 1. Total Expenses This Month
            System.out.println("DEBUG: Calculating total expenses...");
            BigDecimal totalExpensesMonth = financialRecordRepository.sumAmountByPaymentDateBetween(startOfMonth,
                    endOfMonth);
            if (totalExpensesMonth == null)
                totalExpensesMonth = BigDecimal.ZERO;

            // 2. Pending Approvals (Global)
            System.out.println("DEBUG: Counting pending approvals...");
            long pendingApprovals = expenseRequestRepository.countByStatus(ExpenseStatus.PENDING);
            long approvedUnpaid = expenseRequestRepository.countByStatus(ExpenseStatus.APPROVED);

            // 3. Total Stock Value (Capital in Inventory)
            System.out.println("DEBUG: Calculating total stock value...");
            BigDecimal totalStockValue = itemRepository.getTotalStockValue();
            if (totalStockValue == null)
                totalStockValue = BigDecimal.ZERO;

            // 4. Recent Financial Activity
            System.out.println("DEBUG: Fetching recent transactions...");
            List<FinancialRecord> recentTransactions = financialRecordRepository.findTop5ByOrderByPaymentDateDesc();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalExpensesMonth", totalExpensesMonth);
            stats.put("pendingApprovals", pendingApprovals); // Menunggu Approval Atasan
            stats.put("approvedUnpaid", approvedUnpaid); // Menunggu Pembayaran Finance
            stats.put("totalStockValue", totalStockValue);

            System.out.println("DEBUG: Mapping recent transactions...");
            List<Map<String, Object>> recentActivity = recentTransactions.stream().map(r -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("transactionNumber", r.getTransactionNumber());
                map.put("amount", r.getAmount());
                map.put("date", r.getPaymentDate());
                map.put("purpose", r.getExpenseRequest().getPurpose());
                try {
                    map.put("division", r.getExpenseRequest().getUser().getDivision().getName());
                } catch (NullPointerException npe) {
                    map.put("division", "Unknown");
                }
                return map;
            }).collect(Collectors.toList());

            stats.put("recentActivity", recentActivity);
            System.out.println("DEBUG: Director Dashboard Stats Ready.");

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching director dashboard: " + e.getMessage());
        }
    }
}

package com.inventory.system.controller.finance;

import com.inventory.system.model.ExpenseStatus;
import com.inventory.system.model.FinancialRecord;
import com.inventory.system.repository.ExpenseRequestRepository;
import com.inventory.system.repository.FinancialRecordRepository;

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
@RequestMapping("/api/finance/dashboard")
@RequiredArgsConstructor
public class FinanceDashboardController {

    private final ExpenseRequestRepository expenseRequestRepository;
    private final FinancialRecordRepository financialRecordRepository;

    @GetMapping
    public ResponseEntity<?> getStats() {
        LocalDateTime startOfMonth = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = YearMonth.now().atEndOfMonth().atTime(23, 59, 59);

        // 1. Total Paid This Month
        BigDecimal totalPaidMonth = financialRecordRepository.sumAmountByPaymentDateBetween(startOfMonth, endOfMonth);
        if (totalPaidMonth == null)
            totalPaidMonth = BigDecimal.ZERO;

        // 2. Pending Approvals (Approved but not paid)
        long pendingCount = expenseRequestRepository.countByStatus(ExpenseStatus.APPROVED);
        BigDecimal pendingAmount = expenseRequestRepository.sumApprovedExpenses();
        if (pendingAmount == null)
            pendingAmount = BigDecimal.ZERO;

        // 3. Recent Transactions
        List<FinancialRecord> recentTransactions = financialRecordRepository.findTop5ByOrderByPaymentDateDesc();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPaidMonth", totalPaidMonth);
        stats.put("pendingPaymentCount", pendingCount);
        stats.put("pendingPaymentAmount", pendingAmount);

        // Map recent transactions to a simplified view if needed, or send as is
        List<Map<String, Object>> recentActivity = recentTransactions.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("transactionNumber", r.getTransactionNumber());
            map.put("amount", r.getAmount());
            map.put("date", r.getPaymentDate());
            map.put("purpose", r.getExpenseRequest().getPurpose());
            map.put("user", r.getExpenseRequest().getUser().getFullName());
            return map;
        }).collect(Collectors.toList());

        stats.put("recentActivity", recentActivity);

        return ResponseEntity.ok(stats);
    }
}

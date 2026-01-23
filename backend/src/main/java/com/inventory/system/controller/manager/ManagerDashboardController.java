package com.inventory.system.controller.manager;

import com.inventory.system.model.ExpenseStatus;
import com.inventory.system.repository.ExpenseRequestRepository;
import com.inventory.system.repository.ItemRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

import com.inventory.system.model.ExpenseRequest; // Import added
import com.inventory.system.model.Item; // Import added

@RestController
@RequestMapping("/api/manager/dashboard")
@RequiredArgsConstructor
public class ManagerDashboardController {

    private final ExpenseRequestRepository expenseRequestRepository;
    private final ItemRepository itemRepository;

    @GetMapping
    public ResponseEntity<ManagerDashboardStats> getStats() {
        long pendingCount = expenseRequestRepository.countByStatus(ExpenseStatus.PENDING);
        long lowStockCount = itemRepository.findLowStockItems().size();

        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime endOfDay = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);

        java.time.LocalDateTime startOfMonth = java.time.YearMonth.now().atDay(1).atStartOfDay();
        java.time.LocalDateTime endOfMonth = java.time.YearMonth.now().atEndOfMonth().atTime(java.time.LocalTime.MAX);

        System.out.println("DEBUG: Fetching stats for " + startOfDay + " to " + endOfDay);
        BigDecimal todayExpenses = expenseRequestRepository.sumApprovedExpensesBetween(ExpenseStatus.APPROVED,
                startOfDay, endOfDay);
        System.out.println("DEBUG: Today Expenses: " + todayExpenses);

        BigDecimal monthExpenses = expenseRequestRepository.sumApprovedExpensesBetween(ExpenseStatus.APPROVED,
                startOfMonth, endOfMonth);
        System.out.println("DEBUG: Month Expenses: " + monthExpenses);

        Long totalStock = itemRepository.sumTotalStock();

        java.time.LocalDateTime startOfWeeklyChart = java.time.LocalDate.now().minusDays(6).atStartOfDay(); // Last 7
                                                                                                            // days
        java.util.List<ExpenseRequest> lastWeekExpenses = expenseRequestRepository
                .findByStatusAndApprovalDateAfterOrderByApprovalDateAsc(ExpenseStatus.APPROVED, startOfWeeklyChart);

        // Aggregate by Date
        java.util.Map<java.time.LocalDate, BigDecimal> dailyMap = new java.util.HashMap<>();
        // Initialize last 7 days with 0
        for (int i = 0; i < 7; i++) {
            dailyMap.put(java.time.LocalDate.now().minusDays(i), BigDecimal.ZERO);
        }

        for (ExpenseRequest req : lastWeekExpenses) {
            if (req.getApprovalDate() != null) {
                java.time.LocalDate date = req.getApprovalDate().toLocalDate();
                dailyMap.put(date, dailyMap.getOrDefault(date, BigDecimal.ZERO).add(req.getAmount()));
            }
        }

        java.util.List<DailyExpenseStats> dailyStats = dailyMap.entrySet().stream()
                .sorted(java.util.Map.Entry.comparingByKey())
                .map(e -> new DailyExpenseStats(e.getKey().toString(), e.getValue()))
                .collect(java.util.stream.Collectors.toList());

        // Fetch Recent Pending Expenses
        java.util.List<ExpenseRequest> recentPending = expenseRequestRepository
                .findByStatusOrderByRequestDateDesc(ExpenseStatus.PENDING)
                .stream().limit(5).collect(java.util.stream.Collectors.toList());

        // Fetch Top Low Stock Items
        java.util.List<Item> lowStockItems = itemRepository.findLowStockItems()
                .stream().limit(5).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(ManagerDashboardStats.builder()
                .pendingExpensesCount(pendingCount)
                .lowStockItemsCount(lowStockCount)
                .expensesToday(todayExpenses != null ? todayExpenses : BigDecimal.ZERO)
                .expensesMonth(monthExpenses != null ? monthExpenses : BigDecimal.ZERO)
                .totalStockCount(totalStock != null ? totalStock : 0L)
                .dailyExpenses(dailyStats)
                .recentPendingExpenses(recentPending)
                .lowStockItems(lowStockItems)
                .build());
    }

    @Data
    @Builder
    public static class ManagerDashboardStats {
        private long pendingExpensesCount;
        private long lowStockItemsCount;
        private BigDecimal expensesToday;
        private BigDecimal expensesMonth;
        private long totalStockCount;
        private java.util.List<DailyExpenseStats> dailyExpenses;
        private java.util.List<ExpenseRequest> recentPendingExpenses;
        private java.util.List<Item> lowStockItems;
    }

    @Data
    @lombok.AllArgsConstructor
    public static class DailyExpenseStats {
        private String date;
        private BigDecimal total;
    }
}

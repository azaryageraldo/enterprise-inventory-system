package com.inventory.system.controller.employee;

import com.inventory.system.model.ExpenseStatus;
import com.inventory.system.model.User;
import com.inventory.system.payload.response.EmployeeDashboardStats;
import com.inventory.system.repository.ExpenseRequestRepository;
import com.inventory.system.repository.StockTransactionRepository;
import com.inventory.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/employee/dashboard")
@RequiredArgsConstructor
public class EmployeeDashboardController {

    private final ExpenseRequestRepository expenseRequestRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<EmployeeDashboardStats> getDashboardStats() {
        User user = getCurrentUser();
        Long userId = user.getId();

        long stockCount = stockTransactionRepository.countByUserId(userId);
        long pendingExpenses = expenseRequestRepository.countByUserIdAndStatus(userId, ExpenseStatus.PENDING);
        BigDecimal approvedSum = expenseRequestRepository.sumApprovedExpensesByUserId(userId);

        EmployeeDashboardStats stats = EmployeeDashboardStats.builder()
                .totalStockTransactions(stockCount)
                .pendingExpenses(pendingExpenses)
                .approvedExpensesSum(approvedSum != null ? approvedSum : BigDecimal.ZERO)
                .recentExpenses(expenseRequestRepository.findTop5ByUserIdOrderByRequestDateDesc(userId))
                .recentStockTransactions(stockTransactionRepository.findTop5ByUserIdOrderByDateDesc(userId))
                .build();

        return ResponseEntity.ok(stats);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

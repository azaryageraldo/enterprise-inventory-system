package com.inventory.system.controller.manager;

import com.inventory.system.model.ExpenseRequest;
import com.inventory.system.model.ExpenseStatus;
import com.inventory.system.repository.ExpenseRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager/expenses")
@RequiredArgsConstructor
public class ManagerExpenseController {

    private final ExpenseRequestRepository expenseRequestRepository;

    @GetMapping("/pending")
    public ResponseEntity<List<ExpenseRequest>> getPendingExpenses() {
        return ResponseEntity.ok(expenseRequestRepository.findByStatusOrderByRequestDateDesc(ExpenseStatus.PENDING));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveExpense(@PathVariable Long id) {
        ExpenseRequest request = expenseRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense request not found"));

        request.setStatus(ExpenseStatus.APPROVED);
        request.setApprovalDate(java.time.LocalDateTime.now());
        // Note: In a real system, we might want to trigger Finance notification here
        expenseRequestRepository.save(request);

        return ResponseEntity.ok(Map.of("message", "Expense approved successfully"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectExpense(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        ExpenseRequest request = expenseRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense request not found"));

        String reason = payload.getOrDefault("reason", "Rejected by Manager");

        request.setStatus(ExpenseStatus.REJECTED);
        request.setRejectionReason(reason);
        expenseRequestRepository.save(request);

        return ResponseEntity.ok(Map.of("message", "Expense rejected"));
    }
}

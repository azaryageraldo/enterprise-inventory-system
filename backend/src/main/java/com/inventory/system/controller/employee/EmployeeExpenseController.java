package com.inventory.system.controller.employee;

import com.inventory.system.model.ExpenseRequest;
import com.inventory.system.model.ExpenseStatus;
import com.inventory.system.model.User;
import com.inventory.system.repository.ExpenseRequestRepository;
import com.inventory.system.repository.UserRepository;
import com.inventory.system.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/employee/expenses")
@RequiredArgsConstructor
public class EmployeeExpenseController {

    private final ExpenseRequestRepository expenseRequestRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final com.inventory.system.repository.FinancialRecordRepository financialRecordRepository;

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createExpenseRequest(
            @RequestParam("amount") java.math.BigDecimal amount,
            @RequestParam("purpose") String purpose,
            @RequestParam(value = "evidenceType", defaultValue = "LINK") String evidenceType,
            @RequestParam(value = "evidenceLink", required = false) String evidenceLink,
            @RequestParam(value = "evidenceFile", required = false) org.springframework.web.multipart.MultipartFile evidenceFile) {
        try {
            User user = getCurrentUser();

            ExpenseRequest expense = new ExpenseRequest();
            expense.setUser(user);
            expense.setAmount(amount);
            expense.setPurpose(purpose);
            expense.setStatus(ExpenseStatus.PENDING);
            expense.setRequestDate(LocalDateTime.now());
            expense.setEvidenceType(evidenceType);

            if ("FILE".equalsIgnoreCase(evidenceType) && evidenceFile != null && !evidenceFile.isEmpty()) {
                String filename = fileStorageService.store(evidenceFile);
                expense.setEvidenceImage(filename);
            } else {
                expense.setEvidenceImage(evidenceLink);
            }

            ExpenseRequest saved = expenseRequestRepository.save(expense);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Gagal mengajukan pengeluaran: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ExpenseRequest>> getMyExpenses() {
        User user = getCurrentUser();
        return ResponseEntity.ok(expenseRequestRepository.findByUserIdOrderByRequestDateDesc(user.getId()));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<?> getExpenseDetails(@PathVariable Long id) {
        ExpenseRequest expense = expenseRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // Ensure user owns this expense
        User user = getCurrentUser();
        if (!expense.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Unauthorized access to this expense");
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("expense", expense);

        if (expense.getStatus() == ExpenseStatus.PAID) {
            com.inventory.system.model.FinancialRecord record = financialRecordRepository.findByExpenseRequest(expense)
                    .orElse(null);
            if (record != null) {
                response.put("paymentDate", record.getPaymentDate());
                response.put("transactionNumber", record.getTransactionNumber());
                response.put("paymentProof", record.getPaymentProof());
                response.put("paymentMethod", record.getPaymentMethod());
            }
        }

        return ResponseEntity.ok(response);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

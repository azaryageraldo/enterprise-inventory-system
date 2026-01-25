package com.inventory.system.controller.finance;

import com.inventory.system.dto.PaymentRequest;
import com.inventory.system.model.ExpenseRequest;
import com.inventory.system.model.ExpenseStatus;
import com.inventory.system.model.FinancialRecord;
import com.inventory.system.repository.ExpenseRequestRepository;
import com.inventory.system.repository.FinancialRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance/payments")
@RequiredArgsConstructor
public class FinancePaymentController {

    private final ExpenseRequestRepository expenseRequestRepository;
    private final FinancialRecordRepository financialRecordRepository;

    @GetMapping("/approved")
    public ResponseEntity<List<ExpenseRequest>> getApprovedExpenses() {
        // Fetch all expenses with status APPROVED
        // The repository method findByStatus must handle the enum correctly
        List<ExpenseRequest> expenses = expenseRequestRepository.findByStatus(ExpenseStatus.APPROVED);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
        ExpenseRequest expense = expenseRequestRepository.findById(request.getExpenseId())
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (expense.getStatus() != ExpenseStatus.APPROVED) {
            return ResponseEntity.badRequest().body("Expense must be APPROVED to be paid.");
        }

        // Create Financial Record
        FinancialRecord record = new FinancialRecord();
        record.setExpenseRequest(expense);
        record.setTransactionNumber(request.getTransactionNumber());
        record.setPaymentDate(request.getPaymentDate());
        record.setPaymentMethod(request.getPaymentMethod());
        record.setAmount(expense.getAmount()); // Use amount from expense to ensure consistency
        record.setPaymentProof(request.getProofImage());

        financialRecordRepository.save(record);

        // Update Expense Status
        expense.setStatus(ExpenseStatus.PAID);
        expenseRequestRepository.save(expense);

        return ResponseEntity.ok().body("Payment processed successfully");
    }

    @GetMapping("/history")
    public ResponseEntity<List<FinancialRecord>> getTransactionHistory() {
        return ResponseEntity.ok(financialRecordRepository.findAll());
    }
}

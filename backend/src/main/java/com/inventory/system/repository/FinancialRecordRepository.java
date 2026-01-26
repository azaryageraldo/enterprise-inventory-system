package com.inventory.system.repository;

import com.inventory.system.model.FinancialRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {
    List<FinancialRecord> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    java.util.Optional<FinancialRecord> findByExpenseRequest(com.inventory.system.model.ExpenseRequest expenseRequest);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(f.amount) FROM FinancialRecord f WHERE f.paymentDate BETWEEN :start AND :end")
    java.math.BigDecimal sumAmountByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    List<FinancialRecord> findTop5ByOrderByPaymentDateDesc();

    long countByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT f.expenseRequest.user.division.name, SUM(f.amount) FROM FinancialRecord f GROUP BY f.expenseRequest.user.division.name")
    List<Object[]> sumExpensesByDivision();
}

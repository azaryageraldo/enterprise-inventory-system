package com.inventory.system.repository;

import com.inventory.system.model.ExpenseRequest;
import com.inventory.system.model.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;

public interface ExpenseRequestRepository extends JpaRepository<ExpenseRequest, Long> {
    long countByStatus(ExpenseStatus status);

    @Query("SELECT SUM(e.amount) FROM ExpenseRequest e WHERE e.status = 'APPROVED'")
    BigDecimal sumApprovedExpenses();
}

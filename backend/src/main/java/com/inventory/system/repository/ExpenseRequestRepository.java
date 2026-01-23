package com.inventory.system.repository;

import com.inventory.system.model.ExpenseRequest;
import com.inventory.system.model.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRequestRepository extends JpaRepository<ExpenseRequest, Long> {
        List<ExpenseRequest> findByUserIdOrderByRequestDateDesc(Long userId);

        long countByUserId(Long userId);

        long countByStatus(ExpenseStatus status);

        long countByUserIdAndStatus(Long userId, ExpenseStatus status);

        @Query("SELECT SUM(e.amount) FROM ExpenseRequest e WHERE e.status = 'APPROVED'")
        BigDecimal sumApprovedExpenses();

        @Query("SELECT SUM(e.amount) FROM ExpenseRequest e WHERE e.user.id = :userId AND e.status = 'APPROVED'")
        BigDecimal sumApprovedExpensesByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

        List<ExpenseRequest> findTop5ByUserIdOrderByRequestDateDesc(Long userId);

        List<ExpenseRequest> findByStatusOrderByRequestDateDesc(ExpenseStatus status);

        @Query("SELECT SUM(e.amount) FROM ExpenseRequest e WHERE e.status = :status AND e.approvalDate BETWEEN :startDate AND :endDate")
        BigDecimal sumApprovedExpensesBetween(
                        @org.springframework.data.repository.query.Param("status") ExpenseStatus status,
                        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
                        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate);

        List<ExpenseRequest> findByStatusAndApprovalDateAfterOrderByApprovalDateAsc(ExpenseStatus status,
                        java.time.LocalDateTime date);
}

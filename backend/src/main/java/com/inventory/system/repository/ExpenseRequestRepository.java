package com.inventory.system.repository;

import com.inventory.system.model.ExpenseRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRequestRepository extends JpaRepository<ExpenseRequest, Long> {
}

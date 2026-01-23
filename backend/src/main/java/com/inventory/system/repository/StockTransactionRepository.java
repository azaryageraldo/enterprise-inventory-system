package com.inventory.system.repository;

import com.inventory.system.model.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    List<StockTransaction> findByItemIdOrderByDateDesc(Long itemId);

    List<StockTransaction> findAllByOrderByDateDesc();
}

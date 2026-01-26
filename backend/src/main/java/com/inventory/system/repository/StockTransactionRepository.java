package com.inventory.system.repository;

import com.inventory.system.model.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    List<StockTransaction> findByItemIdOrderByDateDesc(Long itemId);

    List<StockTransaction> findAllByOrderByDateDesc();

    List<StockTransaction> findTop5ByUserIdOrderByDateDesc(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT s.item, COUNT(s) as cnt FROM StockTransaction s WHERE s.type = 'OUT' GROUP BY s.item ORDER BY cnt DESC")
    List<Object[]> findToFrequentItems();

    long countByUserId(Long userId);
}

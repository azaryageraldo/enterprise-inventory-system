package com.inventory.system.repository;

import com.inventory.system.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByCode(String code);

    @org.springframework.data.jpa.repository.Query("SELECT i FROM Item i WHERE i.stock <= i.minStock")
    java.util.List<Item> findLowStockItems();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(i.stock) FROM Item i")
    Long sumTotalStock();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(i.stock * i.price) FROM Item i")
    java.math.BigDecimal getTotalStockValue();
}

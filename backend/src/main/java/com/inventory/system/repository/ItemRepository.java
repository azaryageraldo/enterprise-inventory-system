package com.inventory.system.repository;

import com.inventory.system.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByCode(String code);
}

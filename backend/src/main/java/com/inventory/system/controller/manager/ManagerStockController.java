package com.inventory.system.controller.manager;

import com.inventory.system.model.Item;
import com.inventory.system.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/manager/stock")
@RequiredArgsConstructor
public class ManagerStockController {

    private final ItemRepository itemRepository;

    @GetMapping
    public ResponseEntity<List<Item>> getAllStock() {
        return ResponseEntity.ok(itemRepository.findAll());
    }

    @GetMapping("/low")
    public ResponseEntity<List<Item>> getLowStockItems() {
        return ResponseEntity.ok(itemRepository.findLowStockItems());
    }
}

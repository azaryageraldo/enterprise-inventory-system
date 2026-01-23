package com.inventory.system.service;

import com.inventory.system.model.*;
import com.inventory.system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockTransactionService {

    private final StockTransactionRepository stockTransactionRepository;
    private final ItemRepository itemRepository;

    @Transactional
    public StockTransaction recordStockIn(Long itemId, Integer quantity, String notes, User user) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setStock(item.getStock() + quantity);
        itemRepository.save(item);

        StockTransaction tx = new StockTransaction();
        tx.setItem(item);
        tx.setType(StockTransactionType.IN);
        tx.setQuantity(quantity);
        tx.setDate(LocalDateTime.now());
        tx.setNotes(notes);
        tx.setUser(user);

        return stockTransactionRepository.save(tx);
    }

    @Transactional
    public StockTransaction recordStockOut(Long itemId, Integer quantity, String notes, String destination, User user) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (item.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        item.setStock(item.getStock() - quantity);
        itemRepository.save(item);

        String finalNotes = notes;
        if (destination != null && !destination.isEmpty()) {
            finalNotes = "Destination: " + destination + " | " + (notes == null ? "" : notes);
        }

        StockTransaction tx = new StockTransaction();
        tx.setItem(item);
        tx.setType(StockTransactionType.OUT);
        tx.setQuantity(quantity);
        tx.setDate(LocalDateTime.now());
        tx.setNotes(finalNotes);
        tx.setUser(user);

        return stockTransactionRepository.save(tx);
    }

    public List<StockTransaction> getAllTransactions() {
        return stockTransactionRepository.findAllByOrderByDateDesc();
    }

    public List<StockTransaction> getTransactionsByItem(Long itemId) {
        return stockTransactionRepository.findByItemIdOrderByDateDesc(itemId);
    }
}

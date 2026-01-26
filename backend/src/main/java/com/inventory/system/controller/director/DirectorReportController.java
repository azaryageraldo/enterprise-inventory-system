package com.inventory.system.controller.director;

import com.inventory.system.model.Item;
import com.inventory.system.repository.FinancialRecordRepository;
import com.inventory.system.repository.ItemRepository;
import com.inventory.system.repository.StockTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/director/reports")
@RequiredArgsConstructor
public class DirectorReportController {

    private final ItemRepository itemRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final FinancialRecordRepository financialRecordRepository;

    @GetMapping("/stock")
    public ResponseEntity<?> getStockReport() {
        // 1. All Items
        List<Item> allItems = itemRepository.findAll();

        // 2. Low Stock Items
        List<Item> lowStockItems = itemRepository.findLowStockItems();

        // 3. Most Frequent Outgoing Items (Trending)
        List<Object[]> trendingRaw = stockTransactionRepository.findToFrequentItems();
        List<Map<String, Object>> trendingItems = new ArrayList<>();

        // Take top 5
        int limit = Math.min(trendingRaw.size(), 5);
        for (int i = 0; i < limit; i++) {
            Object[] row = trendingRaw.get(i);
            Item item = (Item) row[0];
            Long count = (Long) row[1];

            Map<String, Object> map = new HashMap<>();
            map.put("code", item.getCode());
            map.put("name", item.getName());
            map.put("stock", item.getStock());
            map.put("frequency", count);
            trendingItems.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("allItems", allItems);
        response.put("lowStockItems", lowStockItems);
        response.put("trendingItems", trendingItems);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/expenses")
    public ResponseEntity<?> getExpenseReport() {
        // 1. Total Expenses (Lifetime for now, or we can filter by year)
        // For simplicity let's rely on dashboard endpoint for total monthly,
        // here we provide breakdown.

        // 2. Expenses by Division
        List<Object[]> divisionRaw = financialRecordRepository.sumExpensesByDivision();
        List<Map<String, Object>> byDivision = new ArrayList<>();

        for (Object[] row : divisionRaw) {
            String division = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            Map<String, Object> map = new HashMap<>();
            map.put("name", division);
            map.put("value", amount);
            byDivision.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("byDivision", byDivision);

        return ResponseEntity.ok(response);
    }
}

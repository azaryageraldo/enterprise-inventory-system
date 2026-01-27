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
        System.out.println("DEBUG: Request received for /api/director/reports/expenses");
        try {
            // 1. Total Expenses (Lifetime)
            BigDecimal totalExpenses = financialRecordRepository.sumTotalExpenses();
            if (totalExpenses == null)
                totalExpenses = BigDecimal.ZERO;
            System.out.println("DEBUG: Total Expenses calculated: " + totalExpenses);

            // 2. Expenses by Division
            List<Object[]> divisionRaw = financialRecordRepository.sumExpensesByDivision();
            List<Map<String, Object>> byDivision = new ArrayList<>();
            System.out.println("DEBUG: Division raw data size: " + (divisionRaw != null ? divisionRaw.size() : "null"));

            for (Object[] row : divisionRaw) {
                String division = (String) row[0];
                BigDecimal amount = (BigDecimal) row[1];
                Map<String, Object> map = new HashMap<>();
                map.put("name", division);
                map.put("value", amount);
                byDivision.add(map);
            }

            // 3. Expenses by Month (Trend)
            System.out.println("DEBUG: Fetching monthly expenses...");
            List<Object[]> monthlyRaw = financialRecordRepository.sumExpensesGroupedByMonth();
            System.out.println("DEBUG: Monthly raw data size: " + (monthlyRaw != null ? monthlyRaw.size() : "null"));

            List<Map<String, Object>> byMonth = new ArrayList<>();

            // Month names helper
            String[] monthNames = { "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov",
                    "Des" };

            // Take last 12 months for the chart (reversed from query desc order)
            int monthsLimit = Math.min(monthlyRaw.size(), 12);
            for (int i = monthsLimit - 1; i >= 0; i--) {
                Object[] row = monthlyRaw.get(i);
                int year = ((Number) row[0]).intValue();
                int month = ((Number) row[1]).intValue();
                BigDecimal amount = (BigDecimal) row[2];

                Map<String, Object> map = new HashMap<>();
                map.put("name", monthNames[month - 1] + " " + year);
                map.put("value", amount);
                map.put("originalMonth", month);
                map.put("originalYear", year);
                byMonth.add(map);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("totalExpenses", totalExpenses);
            response.put("byDivision", byDivision);
            response.put("byMonth", byMonth);

            System.out.println("DEBUG: Sending response for expenses report.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("ERROR: Error in getExpenseReport: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/general")
    public ResponseEntity<?> getGeneralReport() {
        System.out.println("DEBUG: Request received for /api/director/reports/general");
        try {
            // 1. Financial Summary
            BigDecimal totalExpenses = financialRecordRepository.sumTotalExpenses();
            if (totalExpenses == null)
                totalExpenses = BigDecimal.ZERO;

            // 2. Stock Summary
            Double totalAssetValue = itemRepository.getTotalStockValue();
            if (totalAssetValue == null)
                totalAssetValue = 0.0;

            Long totalItems = itemRepository.count();
            int lowStockCount = itemRepository.findLowStockItems().size();

            // 3. Asset Distribution by Category
            List<Object[]> assetDistRaw = itemRepository.sumAssetValueByCategory();
            List<Map<String, Object>> assetDistribution = new ArrayList<>();
            if (assetDistRaw != null) {
                for (Object[] row : assetDistRaw) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", row[0]); // Category Name
                    map.put("value", row[1]); // Value
                    assetDistribution.add(map);
                }
            }

            // 4. Monthly Expense Trend (Simplified for General View)
            List<Object[]> monthlyRaw = financialRecordRepository.sumExpensesGroupedByMonth();
            List<Map<String, Object>> expenseTrend = new ArrayList<>();
            String[] monthNames = { "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov",
                    "Des" };
            int monthsLimit = Math.min(monthlyRaw.size(), 6); // Just last 6 months for general view
            for (int i = monthsLimit - 1; i >= 0; i--) {
                Object[] row = monthlyRaw.get(i);
                int year = ((Number) row[0]).intValue();
                int month = ((Number) row[1]).intValue();
                BigDecimal amount = (BigDecimal) row[2];
                Map<String, Object> map = new HashMap<>();
                map.put("name", monthNames[month - 1] + " " + year);
                map.put("value", amount);
                expenseTrend.add(map);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("totalExpenses", totalExpenses);
            response.put("totalAssetValue", totalAssetValue);
            response.put("totalItems", totalItems);
            response.put("lowStockCount", lowStockCount);
            response.put("assetDistribution", assetDistribution);
            response.put("expenseTrend", expenseTrend);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("ERROR: Error in getGeneralReport: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}

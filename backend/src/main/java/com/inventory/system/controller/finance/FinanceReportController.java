package com.inventory.system.controller.finance;

import com.inventory.system.model.FinancialRecord;
import com.inventory.system.repository.FinancialRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/finance/reports")
@RequiredArgsConstructor
public class FinanceReportController {

        private final FinancialRecordRepository financialRecordRepository;

        @GetMapping("/summary")
        public ResponseEntity<Map<String, Object>> getSummary() {
                // Simple Logic: Fetch all (for now) and aggregate.
                // In Prod: optimize queries.
                List<FinancialRecord> records = financialRecordRepository.findAll();

                // Calculate totals
                double totalSpend = records.stream()
                                .mapToDouble(r -> r.getAmount().doubleValue())
                                .sum();

                // Count transactions
                long totalTransactions = records.size();

                Map<String, Object> response = new HashMap<>();
                response.put("totalSpend", totalSpend);
                response.put("totalTransactions", totalTransactions);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/daily")
        public ResponseEntity<List<Map<String, Object>>> getDailyReport() {
                List<FinancialRecord> records = financialRecordRepository.findAll();

                // Group by Date (YYYY-MM-DD)
                Map<LocalDate, Double> grouped = records.stream()
                                .collect(Collectors.groupingBy(
                                                r -> r.getPaymentDate().toLocalDate(),
                                                Collectors.summingDouble(r -> r.getAmount().doubleValue())));

                List<Map<String, Object>> result = grouped.entrySet().stream()
                                .sorted(Map.Entry.comparingByKey())
                                .map(e -> {
                                        Map<String, Object> map = new HashMap<>();
                                        map.put("date", e.getKey().toString());
                                        map.put("amount", e.getValue());
                                        return map;
                                })
                                .collect(Collectors.toList());

                return ResponseEntity.ok(result);
        }

        @GetMapping("/monthly")
        public ResponseEntity<List<Map<String, Object>>> getMonthlyReport() {
                List<FinancialRecord> records = financialRecordRepository.findAll();

                // Group by Year-Month
                Map<String, Double> grouped = records.stream()
                                .collect(Collectors.groupingBy(
                                                r -> r.getPaymentDate().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                                                Collectors.summingDouble(r -> r.getAmount().doubleValue())));

                List<Map<String, Object>> result = grouped.entrySet().stream()
                                .sorted(Map.Entry.comparingByKey())
                                .map(e -> {
                                        Map<String, Object> map = new HashMap<>();
                                        map.put("month", e.getKey());
                                        map.put("amount", e.getValue());
                                        return map;
                                })
                                .collect(Collectors.toList());

                return ResponseEntity.ok(result);
        }

        @GetMapping("/division")
        public ResponseEntity<List<Map<String, Object>>> getDivisionReport() {
                List<FinancialRecord> records = financialRecordRepository.findAll();

                // Group by Division Name (via ExpenseRequest -> User -> Division)
                Map<String, Double> grouped = records.stream()
                                .collect(Collectors.groupingBy(
                                                r -> {
                                                        try {
                                                                return r.getExpenseRequest().getUser().getDivision()
                                                                                .getName();
                                                        } catch (NullPointerException e) {
                                                                return "Lainnya"; // No division assigned
                                                        }
                                                },
                                                Collectors.summingDouble(r -> r.getAmount().doubleValue())));

                List<Map<String, Object>> result = grouped.entrySet().stream()
                                .map(e -> {
                                        Map<String, Object> map = new HashMap<>();
                                        map.put("division", e.getKey());
                                        map.put("amount", e.getValue());
                                        return map;
                                })
                                .collect(Collectors.toList());

                return ResponseEntity.ok(result);
        }
}

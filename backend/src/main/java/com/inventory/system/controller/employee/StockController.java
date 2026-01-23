package com.inventory.system.controller.employee;

import com.inventory.system.model.StockTransaction;
import com.inventory.system.model.User;
import com.inventory.system.payload.request.StockTransactionRequest;
import com.inventory.system.repository.UserRepository;
import com.inventory.system.service.StockTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockTransactionService stockService;
    private final UserRepository userRepository;

    @PostMapping("/in")
    public ResponseEntity<?> stockIn(@RequestBody StockTransactionRequest request) {
        try {
            User user = getCurrentUser();
            StockTransaction tx = stockService.recordStockIn(
                    request.getItemId(),
                    request.getQuantity(),
                    request.getNotes(),
                    user);
            return ResponseEntity.ok(tx);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/out")
    public ResponseEntity<?> stockOut(@RequestBody StockTransactionRequest request) {
        try {
            User user = getCurrentUser();
            StockTransaction tx = stockService.recordStockOut(
                    request.getItemId(),
                    request.getQuantity(),
                    request.getNotes(),
                    request.getDestination(),
                    user);
            return ResponseEntity.ok(tx);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<StockTransaction>> getAllHistory() {
        return ResponseEntity.ok(stockService.getAllTransactions());
    }

    @GetMapping("/history/{itemId}")
    public ResponseEntity<List<StockTransaction>> getItemHistory(@PathVariable Long itemId) {
        return ResponseEntity.ok(stockService.getTransactionsByItem(itemId));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

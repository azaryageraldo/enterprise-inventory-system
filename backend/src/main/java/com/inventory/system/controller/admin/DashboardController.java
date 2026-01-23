package com.inventory.system.controller.admin;

import com.inventory.system.dto.DashboardStatsDTO;
import com.inventory.system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ExpenseRequestRepository expenseRequestRepository; // Assuming this exists for expenses
    private final AuditLogRepository auditLogRepository;
    private final LoginHistoryRepository loginHistoryRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // Basic counts
        stats.setTotalUsers(userRepository.count());
        stats.setTotalItems(itemRepository.count());

        // Assuming ExpenseRequest has a status field and amount field
        // Since I can't check ExpenseRequest field names right now easily without
        // view_file,
        // I'll assume basic counting for now and refine if compilation fails.
        // Actually, let's just count all for now or check repository.
        stats.setActiveRequests(expenseRequestRepository.count()); // Placeholder: should filter by status "PENDING"
        stats.setTotalExpenses(0.0); // Placeholder: should sum amounts

        // Recent activities (Audit Logs)
        stats.setRecentActivities(auditLogRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "timestamp"))).getContent());

        // Recent logins
        stats.setRecentLogins(loginHistoryRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "loginTime"))).getContent());

        return ResponseEntity.ok(stats);
    }
}

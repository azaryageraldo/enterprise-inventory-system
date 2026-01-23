package com.inventory.system.dto;

import com.inventory.system.model.AuditLog;
import com.inventory.system.model.LoginHistory;
import lombok.Data;
import java.util.List;

@Data
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalItems;
    private long activeRequests;
    private double totalExpenses;
    private List<AuditLog> recentActivities;
    private List<LoginHistory> recentLogins;
}

package com.inventory.system.service;

import com.inventory.system.model.ApprovalHistory;
import com.inventory.system.model.AuditLog;
import com.inventory.system.model.LoginHistory;
import com.inventory.system.repository.ApprovalHistoryRepository;
import com.inventory.system.repository.AuditLogRepository;
import com.inventory.system.repository.LoginHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final LoginHistoryRepository loginHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final ApprovalHistoryRepository approvalHistoryRepository;

    // Login History Methods
    public void recordLogin(Long userId, String username, String ipAddress, String userAgent, String status) {
        LoginHistory history = new LoginHistory();
        history.setUserId(userId);
        history.setUsername(username);
        history.setIpAddress(ipAddress);
        history.setUserAgent(userAgent);
        history.setStatus(status);
        history.setLoginTime(LocalDateTime.now());
        loginHistoryRepository.save(history);
    }

    public Page<LoginHistory> getLoginHistory(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        if (startDate != null && endDate != null) {
            return loginHistoryRepository.findByLoginTimeBetween(startDate, endDate, pageable);
        }
        return loginHistoryRepository.findAll(pageable);
    }

    // Audit Log Methods
    public void recordDataChange(Long userId, String username, String action, String entityType, Long entityId,
            String changes) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setChanges(changes);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    public Page<AuditLog> getAuditLogs(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        if (startDate != null && endDate != null) {
            return auditLogRepository.findByTimestampBetween(startDate, endDate, pageable);
        }
        return auditLogRepository.findAll(pageable);
    }

    // Approval History Methods
    public void recordApproval(Long expenseRequestId, Long approverId, String approverName, String action,
            String notes) {
        ApprovalHistory history = new ApprovalHistory();
        history.setExpenseRequestId(expenseRequestId);
        history.setApproverId(approverId);
        history.setApproverName(approverName);
        history.setAction(action);
        history.setNotes(notes);
        history.setTimestamp(LocalDateTime.now());
        approvalHistoryRepository.save(history);
    }

    public Page<ApprovalHistory> getApprovalHistory(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        if (startDate != null && endDate != null) {
            return approvalHistoryRepository.findByTimestampBetween(startDate, endDate, pageable);
        }
        return approvalHistoryRepository.findAll(pageable);
    }
}

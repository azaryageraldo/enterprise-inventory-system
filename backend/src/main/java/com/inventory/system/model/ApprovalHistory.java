package com.inventory.system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "approval_history")
public class ApprovalHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long expenseRequestId;

    private Long approverId;

    private String approverName;

    @Column(nullable = false)
    private String action; // APPROVED, REJECTED

    private String notes;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}

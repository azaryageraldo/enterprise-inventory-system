package com.inventory.system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String username;

    @Column(nullable = false)
    private String action; // CREATE, UPDATE, DELETE

    @Column(nullable = false)
    private String entityType; // USER, ITEM, EXPENSE, etc.

    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String changes; // JSON string description of changes

    @Column(nullable = false)
    private LocalDateTime timestamp;
}

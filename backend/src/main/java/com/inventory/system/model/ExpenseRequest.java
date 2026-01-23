package com.inventory.system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "expense_requests")
public class ExpenseRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Who requested

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String purpose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseStatus status;

    @Column(columnDefinition = "TEXT")
    private String rejectionNote;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    private LocalDateTime approvalDate;

    private String evidenceImage; // Path to image or Link

    @Column(length = 20)
    private String evidenceType; // "LINK", "FILE"
}

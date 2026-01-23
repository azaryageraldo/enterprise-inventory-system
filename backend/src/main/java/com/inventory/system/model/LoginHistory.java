package com.inventory.system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "login_history")
public class LoginHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String username;

    private String ipAddress;

    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime loginTime;

    @Column(nullable = false)
    private String status; // SUCCESS, FAILED
}

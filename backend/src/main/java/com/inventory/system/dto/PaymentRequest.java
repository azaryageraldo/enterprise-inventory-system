package com.inventory.system.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentRequest {
    private Long expenseId;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private String transactionNumber;
    private BigDecimal amount; // For validation matching
    private String proofImage; // Optional, if we supported upload
}

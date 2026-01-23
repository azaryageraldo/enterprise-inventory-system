package com.inventory.system.payload.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ExpenseRequestRequest {
    private BigDecimal amount;
    private String purpose;
    private String evidenceImage; // Link/Path or description of evidence
}

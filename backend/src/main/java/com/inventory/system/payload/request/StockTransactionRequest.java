package com.inventory.system.payload.request;

import lombok.Data;

@Data
public class StockTransactionRequest {
    private Long itemId;
    private Integer quantity;
    private String notes;
    private String destination; // Optional, for OUT
}

package com.inventory.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String role;
    private String fullName;
    private Long divisionId;
    private String divisionName;
}

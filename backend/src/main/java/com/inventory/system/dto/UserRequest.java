package com.inventory.system.dto;

import com.inventory.system.model.Role;
import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password; // Optional for updates
    private String fullName;
    private Role role;
    private Long divisionId;
}

package com.inventory.system.controller;

import com.inventory.system.config.JwtService;
import com.inventory.system.dto.LoginRequest;
import com.inventory.system.dto.LoginResponse;
import com.inventory.system.model.User;
import com.inventory.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final com.inventory.system.service.ActivityLogService activityLogService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        System.out.println("DEBUG: Login attempt for username: " + request.getUsername());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            System.out.println("DEBUG: Authentication failed for: " + request.getUsername());
            // Record failed login
            Long userId = null;
            var user = userRepository.findByUsername(request.getUsername()).orElse(null);
            if (user != null)
                userId = user.getId();

            activityLogService.recordLogin(userId, request.getUsername(), ipAddress, userAgent, "FAILED");

            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(); // Should exist if auth succeeded

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        System.out.println("DEBUG: Login successful for: " + user.getUsername());
        System.out.println("DEBUG: User Role: " + user.getRole().name());

        // Record successful login
        activityLogService.recordLogin(user.getId(), user.getUsername(), ipAddress, userAgent, "SUCCESS");

        LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getRole().name(),
                user.getFullName(),
                user.getDivision() != null ? user.getDivision().getId() : null,
                user.getDivision() != null ? user.getDivision().getName() : null);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", user.getUsername());
        userInfo.put("fullName", user.getFullName());
        userInfo.put("role", user.getRole().name());
        userInfo.put("divisionId", user.getDivision() != null ? user.getDivision().getId() : null);
        userInfo.put("divisionName", user.getDivision() != null ? user.getDivision().getName() : null);

        return ResponseEntity.ok(userInfo);
    }
}

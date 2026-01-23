package com.inventory.system.repository;

import com.inventory.system.model.LoginHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    Page<LoginHistory> findByLoginTimeBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<LoginHistory> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
}

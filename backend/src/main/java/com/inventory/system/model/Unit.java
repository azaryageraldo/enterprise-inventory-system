package com.inventory.system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "units")
public class Unit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}

package com.inventory.system.controller;

import com.inventory.system.model.Category;
import com.inventory.system.model.Unit;
import com.inventory.system.repository.CategoryRepository;
import com.inventory.system.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/master-data")
@RequiredArgsConstructor
public class SharedMasterDataController {

    private final CategoryRepository categoryRepository;
    private final UnitRepository unitRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/units")
    public ResponseEntity<List<Unit>> getAllUnits() {
        return ResponseEntity.ok(unitRepository.findAll());
    }
}

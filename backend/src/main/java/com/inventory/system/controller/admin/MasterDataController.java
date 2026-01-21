package com.inventory.system.controller.admin;

import com.inventory.system.dto.MasterDataRequest;
import com.inventory.system.model.*;
import com.inventory.system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/master")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MasterDataController {

    private final CategoryRepository categoryRepository;
    private final UnitRepository unitRepository;
    private final DivisionRepository divisionRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    // --- Categories ---
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping("/categories")
    public Category createCategory(@RequestBody MasterDataRequest request) {
        Category c = new Category();
        c.setName(request.getName());
        return categoryRepository.save(c);
    }

    @PutMapping("/categories/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody MasterDataRequest request) {
        Category c = categoryRepository.findById(id).orElseThrow();
        c.setName(request.getName());
        return categoryRepository.save(c);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Units ---
    @GetMapping("/units")
    public List<Unit> getAllUnits() {
        return unitRepository.findAll();
    }

    @PostMapping("/units")
    public Unit createUnit(@RequestBody MasterDataRequest request) {
        Unit u = new Unit();
        u.setName(request.getName());
        return unitRepository.save(u);
    }

    @PutMapping("/units/{id}")
    public Unit updateUnit(@PathVariable Long id, @RequestBody MasterDataRequest request) {
        Unit u = unitRepository.findById(id).orElseThrow();
        u.setName(request.getName());
        return unitRepository.save(u);
    }

    @DeleteMapping("/units/{id}")
    public ResponseEntity<?> deleteUnit(@PathVariable Long id) {
        unitRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Divisions ---
    @GetMapping("/divisions")
    public List<Division> getAllDivisions() {
        return divisionRepository.findAll();
    }

    @PostMapping("/divisions")
    public Division createDivision(@RequestBody MasterDataRequest request) {
        Division d = new Division();
        d.setName(request.getName());
        return divisionRepository.save(d);
    }

    @PutMapping("/divisions/{id}")
    public Division updateDivision(@PathVariable Long id, @RequestBody MasterDataRequest request) {
        Division d = divisionRepository.findById(id).orElseThrow();
        d.setName(request.getName());
        return divisionRepository.save(d);
    }

    @DeleteMapping("/divisions/{id}")
    public ResponseEntity<?> deleteDivision(@PathVariable Long id) {
        divisionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Expense Categories ---
    @GetMapping("/expense-categories")
    public List<ExpenseCategory> getAllExpenseCategories() {
        return expenseCategoryRepository.findAll();
    }

    @PostMapping("/expense-categories")
    public ExpenseCategory createExpenseCategory(@RequestBody MasterDataRequest request) {
        ExpenseCategory ec = new ExpenseCategory();
        ec.setName(request.getName());
        ec.setDescription(request.getDescription());
        return expenseCategoryRepository.save(ec);
    }

    @PutMapping("/expense-categories/{id}")
    public ExpenseCategory updateExpenseCategory(@PathVariable Long id, @RequestBody MasterDataRequest request) {
        ExpenseCategory ec = expenseCategoryRepository.findById(id).orElseThrow();
        ec.setName(request.getName());
        ec.setDescription(request.getDescription());
        return expenseCategoryRepository.save(ec);
    }

    @DeleteMapping("/expense-categories/{id}")
    public ResponseEntity<?> deleteExpenseCategory(@PathVariable Long id) {
        expenseCategoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Payment Methods ---
    @GetMapping("/payment-methods")
    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    @PostMapping("/payment-methods")
    public PaymentMethod createPaymentMethod(@RequestBody MasterDataRequest request) {
        PaymentMethod pm = new PaymentMethod();
        pm.setName(request.getName());
        pm.setDescription(request.getDescription());
        return paymentMethodRepository.save(pm);
    }

    @PutMapping("/payment-methods/{id}")
    public PaymentMethod updatePaymentMethod(@PathVariable Long id, @RequestBody MasterDataRequest request) {
        PaymentMethod pm = paymentMethodRepository.findById(id).orElseThrow();
        pm.setName(request.getName());
        pm.setDescription(request.getDescription());
        return paymentMethodRepository.save(pm);
    }

    @DeleteMapping("/payment-methods/{id}")
    public ResponseEntity<?> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

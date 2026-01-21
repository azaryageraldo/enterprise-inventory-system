package com.inventory.system.config;

import com.inventory.system.model.*;
import com.inventory.system.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DivisionRepository divisionRepository;
    private final CategoryRepository categoryRepository;
    private final UnitRepository unitRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, DivisionRepository divisionRepository,
            CategoryRepository categoryRepository, UnitRepository unitRepository,
            ExpenseCategoryRepository expenseCategoryRepository, PaymentMethodRepository paymentMethodRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.divisionRepository = divisionRepository;
        this.categoryRepository = categoryRepository;
        this.unitRepository = unitRepository;
        this.expenseCategoryRepository = expenseCategoryRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedDivisions();
        seedCategories();
        seedUnits();
        seedExpenseCategories();
        seedPaymentMethods();
        seedUsers();
    }

    private void seedDivisions() {
        if (divisionRepository.count() == 0) {
            List<String> names = Arrays.asList("IT", "HR", "Finance", "Operations", "Marketing");
            for (String name : names) {
                Division d = new Division();
                d.setName(name);
                divisionRepository.save(d);
            }
            System.out.println("Seeded Divisions");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<String> names = Arrays.asList("Electronics", "Furniture", "Stationery", "Cleaning Supplies");
            for (String name : names) {
                Category c = new Category();
                c.setName(name);
                categoryRepository.save(c);
            }
            System.out.println("Seeded Categories");
        }
    }

    private void seedUnits() {
        if (unitRepository.count() == 0) {
            List<String> names = Arrays.asList("Pcs", "Box", "Kg", "Liter", "Meter", "Rim");
            for (String name : names) {
                Unit u = new Unit();
                u.setName(name);
                unitRepository.save(u);
            }
            System.out.println("Seeded Units");
        }
    }

    private void seedExpenseCategories() {
        if (expenseCategoryRepository.count() == 0) {
            createExpenseCategory("Operational", "Daily operational expenses");
            createExpenseCategory("Marketing", "Advertising and promotion");
            createExpenseCategory("Utilities", "Electricity, water, internet");
            createExpenseCategory("Maintenance", "Repairs and maintenance");
            createExpenseCategory("Salaries", "Employee salaries");
            System.out.println("Seeded Expense Categories");
        }
    }

    private void createExpenseCategory(String name, String description) {
        ExpenseCategory ec = new ExpenseCategory();
        ec.setName(name);
        ec.setDescription(description);
        expenseCategoryRepository.save(ec);
    }

    private void seedPaymentMethods() {
        if (paymentMethodRepository.count() == 0) {
            createPaymentMethod("Cash", "Physical cash payment");
            createPaymentMethod("Bank Transfer", "Direct bank transfer");
            createPaymentMethod("Credit Card", "Credit card payment");
            createPaymentMethod("E-Wallet", "Digital wallet payment");
            createPaymentMethod("Cheque", "Bank cheque");
            System.out.println("Seeded Payment Methods");
        }
    }

    private void createPaymentMethod(String name, String description) {
        PaymentMethod pm = new PaymentMethod();
        pm.setName(name);
        pm.setDescription(description);
        paymentMethodRepository.save(pm);
    }

    private void seedUsers() {
        // Always ensure admin and other specific users exist with correct passwords
        // Note: This might overwrite changes if names match, but ensures we fix the
        // password

        Division it = getDivision("IT");
        Division finance = getDivision("Finance");
        Division ops = getDivision("Operations");
        Division marketing = getDivision("Marketing");

        createUser("admin", "12345", "System Admin", Role.ADMIN, it);
        createUser("pegawai", "12345", "Staff Operasional", Role.PEGAWAI, ops);
        createUser("atasan", "12345", "Supervisor Ops", Role.ATASAN, ops);
        createUser("keuangan", "12345", "Staff Keuangan", Role.KEUANGAN, finance);
        createUser("pimpinan", "12345", "Direktur Utama", Role.PIMPINAN, marketing);

        System.out.println("Seeded/Updated Users");
    }

    private Division getDivision(String name) {
        return divisionRepository.findAll().stream()
                .filter(d -> d.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    private void createUser(String username, String password, String fullName, Role role, Division division) {
        User u = userRepository.findByUsername(username).orElse(new User());

        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password));
        u.setFullName(fullName);
        u.setRole(role);
        u.setDivision(division);
        userRepository.save(u);
    }
}

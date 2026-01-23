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

    private final ItemRepository itemRepository;

    public DataSeeder(UserRepository userRepository, DivisionRepository divisionRepository,
            CategoryRepository categoryRepository, UnitRepository unitRepository,
            ExpenseCategoryRepository expenseCategoryRepository, PaymentMethodRepository paymentMethodRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
            ItemRepository itemRepository) {
        this.userRepository = userRepository;
        this.divisionRepository = divisionRepository;
        this.categoryRepository = categoryRepository;
        this.unitRepository = unitRepository;
        this.expenseCategoryRepository = expenseCategoryRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.passwordEncoder = passwordEncoder;
        this.itemRepository = itemRepository;
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
        seedItems();
    }

    private void seedDivisions() {
        if (divisionRepository.count() == 0) {
            List<String> names = Arrays.asList("Teknologi Informasi", "SDM", "Keuangan", "Operasional", "Pemasaran");
            for (String name : names) {
                Division d = new Division();
                d.setName(name);
                divisionRepository.save(d);
            }
            System.out.println("Seeded Divisions (Indonesian)");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<String> names = Arrays.asList("Elektronik", "Mebel", "Alat Tulis Kantor", "Kebersihan");
            for (String name : names) {
                Category c = new Category();
                c.setName(name);
                categoryRepository.save(c);
            }
            System.out.println("Seeded Categories (Indonesian)");
        }
    }

    private void seedUnits() {
        if (unitRepository.count() == 0) {
            List<String> names = Arrays.asList("Pcs", "Box", "Kg", "Liter", "Meter", "Rim", "Lusin");
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
            createExpenseCategory("Operasional", "Biaya operasional harian");
            createExpenseCategory("Pemasaran", "Iklan dan promosi");
            createExpenseCategory("Utilitas", "Listrik, air, internet");
            createExpenseCategory("Perawatan", "Perbaikan dan perawatan aset");
            createExpenseCategory("Gaji", "Gaji dan tunjangan karyawan");
            createExpenseCategory("Perjalanan Dinas", "Biaya transportasi dan akomodasi");
            System.out.println("Seeded Expense Categories (Indonesian)");
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
            createPaymentMethod("Tunai", "Pembayaran tunai langsung");
            createPaymentMethod("Transfer Bank", "Transfer antar rekening bank");
            createPaymentMethod("Kartu Kredit", "Pembayaran menggunakan kartu kredit");
            createPaymentMethod("Dompet Digital", "OVO, GoPay, Dana, dll");
            createPaymentMethod("Cek", "Cek bank");
            System.out.println("Seeded Payment Methods (Indonesian)");
        }
    }

    private void createPaymentMethod(String name, String description) {
        PaymentMethod pm = new PaymentMethod();
        pm.setName(name);
        pm.setDescription(description);
        paymentMethodRepository.save(pm);
    }

    private void seedUsers() {
        // Map old divisions to new Indonesian ones for robustness (if searching
        // strictly by name)
        // But since we just seeded new ones, we look them up fresh.

        Division it = getDivision("Teknologi Informasi");
        Division finance = getDivision("Keuangan");
        Division ops = getDivision("Operasional");
        Division marketing = getDivision("Pemasaran");
        Division hr = getDivision("SDM");

        // Create users with Indonesian descriptions/names where applicable
        createUser("admin", "12345", "Administrator Sistem", Role.ADMIN, it);
        createUser("pegawai", "12345", "Staf Operasional", Role.PEGAWAI, ops);
        createUser("atasan", "12345", "Supervisor Ops", Role.ATASAN, ops);
        createUser("keuangan", "12345", "Staf Keuangan", Role.KEUANGAN, finance);
        createUser("pimpinan", "12345", "Direktur Utama", Role.PIMPINAN, marketing);

        // Add HR user just in case
        createUser("hrd", "12345", "Manajer SDM", Role.ADMIN, hr);

        System.out.println("Seeded/Updated Users (Indonesian)");
    }

    private void seedItems() {
        if (itemRepository.count() == 0) {
            Category electronics = getCategory("Elektronik");
            Category furniture = getCategory("Mebel");
            Category stationery = getCategory("Alat Tulis Kantor");
            Category cleaning = getCategory("Kebersihan");

            Unit pcs = getUnit("Pcs");
            Unit rim = getUnit("Rim");
            Unit box = getUnit("Box");
            Unit liter = getUnit("Liter");

            createItem("Laptop Dell XPS 13", "IT-001", 15, 25000000.0, electronics, pcs);
            createItem("Mouse Wireless Logitech", "IT-002", 50, 350000.0, electronics, pcs);
            createItem("Kursi Kantor Ergonomis", "FUR-001", 20, 1500000.0, furniture, pcs);
            createItem("Kertas A4 80gsm", "ATK-001", 100, 55000.0, stationery, rim);
            createItem("Pulpen Hitam Pilot", "ATK-002", 200, 35000.0, stationery, box);
            createItem("Pembersih Lantai", "CLN-001", 50, 45000.0, cleaning, liter);

            System.out.println("Seeded Items (Indonesian)");
        }
    }

    private void createItem(String name, String code, Integer stock, Double price, Category category, Unit unit) {
        Item item = new Item();
        item.setName(name);
        item.setCode(code);
        item.setStock(stock);
        item.setPrice(price);
        item.setCategory(category);
        item.setUnit(unit);
        itemRepository.save(item);
    }

    private Category getCategory(String name) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals(name)).findFirst().orElse(null);
    }

    private Unit getUnit(String name) {
        return unitRepository.findAll().stream()
                .filter(u -> u.getName().equals(name)).findFirst().orElse(null);
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

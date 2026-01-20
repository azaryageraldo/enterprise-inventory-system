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

    public DataSeeder(UserRepository userRepository, DivisionRepository divisionRepository,
            CategoryRepository categoryRepository, UnitRepository unitRepository) {
        this.userRepository = userRepository;
        this.divisionRepository = divisionRepository;
        this.categoryRepository = categoryRepository;
        this.unitRepository = unitRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedDivisions();
        seedCategories();
        seedUnits();
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

    private void seedUsers() {
        if (userRepository.count() == 0) {
            // Helper to find division
            Division it = divisionRepository.findAll().stream().filter(d -> d.getName().equals("IT")).findFirst()
                    .orElse(null);
            Division finance = divisionRepository.findAll().stream().filter(d -> d.getName().equals("Finance"))
                    .findFirst().orElse(null);
            Division ops = divisionRepository.findAll().stream().filter(d -> d.getName().equals("Operations"))
                    .findFirst().orElse(null);
            Division marketing = divisionRepository.findAll().stream().filter(d -> d.getName().equals("Marketing"))
                    .findFirst().orElse(null);

            createUser("admin", "12345", "System Admin", Role.ADMIN, it);
            createUser("pegawai", "12345", "Staff Operasional", Role.PEGAWAI, ops);
            createUser("atasan", "12345", "Supervisor Ops", Role.ATASAN, ops);
            createUser("keuangan", "12345", "Staff Keuangan", Role.KEUANGAN, finance);
            createUser("pimpinan", "12345", "Direktur Utama", Role.PIMPINAN, marketing);

            System.out.println("Seeded Users");
        }
    }

    private void createUser(String username, String password, String fullName, Role role, Division division) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(password); // In real app, encrypt this!
        u.setFullName(fullName);
        u.setRole(role);
        u.setDivision(division);
        userRepository.save(u);
    }
}

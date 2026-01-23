package com.inventory.system.controller.employee;

import com.inventory.system.model.Item;
import com.inventory.system.payload.request.ItemRequest;
import com.inventory.system.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI', 'ATASAN', 'PIMPINAN', 'KEUANGAN')")
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI', 'ATASAN', 'PIMPINAN')")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')") // Allowed as per requirements
    public ResponseEntity<?> createItem(@Valid @RequestBody ItemRequest request) {
        try {
            Item item = itemService.createItem(request);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody ItemRequest request) {
        try {
            Item item = itemService.updateItem(id, request);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PEGAWAI')")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.ok().body("Item deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

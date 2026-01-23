package com.inventory.system.service;

import com.inventory.system.model.Category;
import com.inventory.system.model.Item;
import com.inventory.system.model.Unit;
import com.inventory.system.payload.request.ItemRequest;
import com.inventory.system.repository.CategoryRepository;
import com.inventory.system.repository.ItemRepository;
import com.inventory.system.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final UnitRepository unitRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    @Transactional
    public Item createItem(ItemRequest request) {
        if (itemRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Item code already exists: " + request.getCode());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        Item item = new Item();
        updateItemFromRequest(item, request, category, unit);

        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItem(Long id, ItemRequest request) {
        Item item = getItemById(id);

        // Check code uniqueness if changed
        if (!item.getCode().equals(request.getCode()) && itemRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Item code already exists: " + request.getCode());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        updateItemFromRequest(item, request, category, unit);

        return itemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found");
        }
        itemRepository.deleteById(id);
    }

    private void updateItemFromRequest(Item item, ItemRequest request, Category category, Unit unit) {
        item.setName(request.getName());
        item.setCode(request.getCode());
        item.setStock(request.getStock());
        item.setPrice(request.getPrice());
        item.setCategory(category);
        item.setUnit(unit);
    }
}

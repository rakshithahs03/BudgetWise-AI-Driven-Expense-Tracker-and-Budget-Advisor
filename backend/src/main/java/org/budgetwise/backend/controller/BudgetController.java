package org.budgetwise.backend.controller;

import org.budgetwise.backend.dto.BudgetDTO;
import org.budgetwise.backend.model.Budget;
import org.budgetwise.backend.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Budget> createBudget(
            @PathVariable int userId,
            @RequestBody Budget budget
    ) {
        return ResponseEntity.ok(budgetService.createBudget(userId, budget));
    }

    @PutMapping("/{budgetId}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable int budgetId,
            @RequestBody Budget updatedBudget
    ) {
        return ResponseEntity.ok(budgetService.updateBudget(budgetId, updatedBudget));
    }

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(@PathVariable int budgetId) { // Change return type to ResponseEntity<Void>
        budgetService.deleteBudget(budgetId);
        return ResponseEntity.noContent().build(); // ✅ Return 204 No Content
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(budgetService.getBudgetsByUser(userId));
    }

    @GetMapping("/{budgetId}/remaining")
    public ResponseEntity<Double> getRemainingBudget(@PathVariable int budgetId) {
        return ResponseEntity.ok(budgetService.getRemainingBudget(budgetId));
    }
}

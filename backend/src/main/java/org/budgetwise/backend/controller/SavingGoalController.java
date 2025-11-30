package org.budgetwise.backend.controller;

import org.budgetwise.backend.dto.SavingGoalDTO;
import org.budgetwise.backend.model.SavingGoal;
import org.budgetwise.backend.service.SavingGoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saving-goals")
public class SavingGoalController {

    private final SavingGoalService savingGoalService;

    public SavingGoalController(SavingGoalService savingGoalService) {
        this.savingGoalService = savingGoalService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<SavingGoalDTO> createSavingGoal(
            @PathVariable int userId,
            @RequestBody SavingGoal savingGoal
    ) {
        return ResponseEntity.ok(savingGoalService.createSavingGoal(userId, savingGoal));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavingGoalDTO>> getSavingGoalsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(savingGoalService.getSavingGoalsByUser(userId));
    }

    @PutMapping("/{goalId}")
    public ResponseEntity<SavingGoalDTO> updateSavingGoal(
            @PathVariable int goalId,
            @RequestBody SavingGoal updatedSavingGoal
    ) {
        return ResponseEntity.ok(savingGoalService.updateSavingGoal(goalId, updatedSavingGoal));
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteSavingGoal(@PathVariable int goalId) {
        savingGoalService.deleteSavingGoal(goalId);
        return ResponseEntity.noContent().build();
    }
}
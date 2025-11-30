package org.budgetwise.backend.dto;

import org.budgetwise.backend.model.SavingGoal;

import java.time.LocalDate;

public record SavingGoalDTO(
        int id,
        String category,
        double targetAmount,
        double savedAmount,
        LocalDate deadline,
        int userId
) {
    public static SavingGoalDTO fromEntity(SavingGoal goal) {
        return new SavingGoalDTO(
                goal.getId(),
                goal.getCategory(),
                goal.getTargetAmount(),
                goal.getSavedAmount(),
                goal.getDeadline(),
                goal.getUser().getId()
        );
    }
}
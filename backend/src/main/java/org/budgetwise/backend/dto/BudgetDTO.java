package org.budgetwise.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BudgetDTO {
    private int id;
    private String category;
    private double limitAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private double spentAmount;

    public static BudgetDTO fromEntity(org.budgetwise.backend.model.Budget budget) {
        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setCategory(budget.getCategory());
        dto.setLimitAmount(budget.getLimitAmount());
        dto.setStartDate(budget.getStartDate());
        dto.setEndDate(budget.getEndDate());
        dto.setSpentAmount(budget.getSpentAmount());
        return dto;
    }
}

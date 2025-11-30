package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseSummaryDTO {
    private double totalSpendThisMonth;
    private double averageDailySpend;
    private String highestSpendingCategory;
}
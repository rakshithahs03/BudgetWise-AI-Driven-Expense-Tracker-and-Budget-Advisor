package org.budgetwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MonthlySummaryDTO {
    private double totalIncome;
    private double totalExpenses;
    private double netSavings;
    private List<CategorySpendingDTO> topSpendingCategories;
    private TrendDataDTO incomeVsExpenseTrend;
}
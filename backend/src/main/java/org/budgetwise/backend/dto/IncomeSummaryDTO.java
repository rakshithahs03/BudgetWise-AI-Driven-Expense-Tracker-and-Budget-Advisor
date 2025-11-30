package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncomeSummaryDTO {
    private double totalIncomeThisMonth;
    private String highestIncomeCategory;
}
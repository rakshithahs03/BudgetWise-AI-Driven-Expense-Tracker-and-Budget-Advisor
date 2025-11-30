package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CashFlowDTO {
    private double monthlyIncome;
    private double totalExpenses;
    private double moneyLeftToSpend;
}
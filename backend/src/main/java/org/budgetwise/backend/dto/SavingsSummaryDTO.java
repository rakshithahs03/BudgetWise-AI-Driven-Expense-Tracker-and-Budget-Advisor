package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavingsSummaryDTO {
    private double totalSavedThisMonth;
    private int goalsMet;
    private int goalsInProgress;
}
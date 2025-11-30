package org.budgetwise.backend.service;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.BudgetDTO;
import org.budgetwise.backend.model.Budget;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.BudgetRepository;
import org.budgetwise.backend.repository.TransactionRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public Budget createBudget(int userId, Budget budget) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        budget.setUser(user);

        // ✅ FIX: Calculate initial spent amount using the budget's date range
        BigDecimal totalSpent = transactionRepository.calculateTotalSpentForCategoryBetweenDates(
                userId,
                budget.getCategory(),
                budget.getStartDate(),
                budget.getEndDate()
        );
        budget.setSpentAmount(totalSpent.doubleValue());

        return budgetRepository.save(budget);
    }

    public Budget updateBudget(int budgetId, Budget updatedBudget) {
        Budget existing = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        existing.setCategory(updatedBudget.getCategory());
        existing.setLimitAmount(updatedBudget.getLimitAmount());
        existing.setSpentAmount(updatedBudget.getSpentAmount());
        existing.setStartDate(updatedBudget.getStartDate());
        existing.setEndDate(updatedBudget.getEndDate());

        return budgetRepository.save(existing);
    }

    public void deleteBudget(int budgetId) {
        budgetRepository.deleteById(budgetId);
    }

    public List<BudgetDTO> getBudgetsByUser(int userId) {
        return budgetRepository.findByUserId(userId)
                .stream()
                .map(BudgetDTO::fromEntity)
                .toList();
    }

    public double getRemainingBudget(int budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return budget.getLimitAmount() - budget.getSpentAmount();
    }
}

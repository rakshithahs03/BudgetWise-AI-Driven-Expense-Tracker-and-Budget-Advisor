package org.budgetwise.backend.service;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.TransactionDTO;
import org.budgetwise.backend.model.*;
import org.budgetwise.backend.repository.BudgetRepository;
import org.budgetwise.backend.repository.SavingGoalRepository;
import org.budgetwise.backend.repository.TransactionRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final SavingGoalRepository savingGoalRepository;


    @Transactional
    public TransactionDTO addTransaction(int userId, Transaction transaction) {
        User user = userRepository.findById(userId).orElseThrow();
        transaction.setUser(user);
        Transaction savedTransaction = transactionRepository.save(transaction);

        if (savedTransaction.getType() == TransactionType.EXPENSE) {
            updateBudgetForTransaction(savedTransaction);
        } else if (savedTransaction.getType() == TransactionType.SAVINGS) {
            updateSavingGoalForCategory(userId, savedTransaction.getCategory());
        }

        return TransactionDTO.fromEntity(savedTransaction);
    }

    @Transactional
    public void deleteTransaction(int id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transactionRepository.deleteById(id);

        if (transaction.getType() == TransactionType.EXPENSE) {
            updateBudgetForTransaction(transaction);
        } else if (transaction.getType() == TransactionType.SAVINGS) {
            updateSavingGoalForCategory(transaction.getUser().getId(), transaction.getCategory());
        }
    }

    @Transactional
    public void importTransactions(int userId, List<Transaction> transactions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        for (Transaction t : transactions) {
            t.setUser(user);
        }
        transactionRepository.saveAll(transactions);

        transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .forEach(this::updateBudgetForTransaction);

        transactions.stream()
                .filter(t -> t.getType() == TransactionType.SAVINGS)
                .forEach(t -> updateSavingGoalForCategory(userId, t.getCategory()));
    }

    @Transactional
    public TransactionDTO editTransaction(int id, Transaction updatedTransaction) {
        Transaction existingTransaction = transactionRepository.findById(id).orElseThrow();

        // Create a copy of the old transaction state to update its original budget if needed
        Transaction oldTransactionState = new Transaction();
        oldTransactionState.setUser(existingTransaction.getUser());
        oldTransactionState.setCategory(existingTransaction.getCategory());
        oldTransactionState.setDate(existingTransaction.getDate());
        oldTransactionState.setType(existingTransaction.getType());

        // Apply updates
        existingTransaction.setType(updatedTransaction.getType());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setCategory(updatedTransaction.getCategory());
        existingTransaction.setDescription(updatedTransaction.getDescription());
        existingTransaction.setDate(updatedTransaction.getDate());

        Transaction savedTransaction = transactionRepository.save(existingTransaction);

        // Update budget for the *new* transaction state
        if (savedTransaction.getType() == TransactionType.EXPENSE) {
            updateBudgetForTransaction(savedTransaction);
        }

        // If the old transaction was an expense and its date or category has changed,
        // we must also update its original budget.
        if (oldTransactionState.getType() == TransactionType.EXPENSE &&
                (!oldTransactionState.getCategory().equals(savedTransaction.getCategory()) ||
                        !oldTransactionState.getDate().equals(savedTransaction.getDate()) ||
                        savedTransaction.getType() != TransactionType.EXPENSE)) {
            updateBudgetForTransaction(oldTransactionState);
        }

        return TransactionDTO.fromEntity(savedTransaction);
    }

    private void updateBudgetForTransaction(Transaction transaction) {
        int userId = transaction.getUser().getId();
        String category = transaction.getCategory();
        LocalDate transactionDate = transaction.getDate();

        // Find a budget that covers the transaction's date for that category
        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndCategoryAndDate(userId, category, transactionDate);

        if (budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            // Recalculate the total spent for that budget's specific date range
            BigDecimal totalSpent = transactionRepository.calculateTotalSpentForCategoryBetweenDates(
                    userId,
                    budget.getCategory(),
                    budget.getStartDate(),
                    budget.getEndDate()
            );
            budget.setSpentAmount(totalSpent.doubleValue());
            budgetRepository.save(budget);
        }
    }

    public List<TransactionDTO> getTransactionsByUser(int userId) {
        return transactionRepository.findByUserId(userId)
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();
    }

    public List<String> getCategories(int userId) {
        return transactionRepository.findDistinctCategoriesByUserId(userId);
    }

    private void updateSavingGoalForCategory(int userId, String category) {
        Optional<SavingGoal> savingGoalOpt = savingGoalRepository.findByUserIdAndCategory(userId, category);
        if (savingGoalOpt.isPresent()) {
            SavingGoal savingGoal = savingGoalOpt.get();
            BigDecimal totalSaved = transactionRepository.calculateTotalSavedForCategory(userId, category);
            savingGoal.setSavedAmount(totalSaved.doubleValue());
            savingGoalRepository.save(savingGoal);
        }
    }

    public List<TransactionDTO> getFilteredTransactions(int userId, TransactionType type, String category, LocalDate startDate, LocalDate endDate) {
        Specification<Transaction> spec = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("id"), userId);

        if (type != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type));
        }
        if (category != null && !category.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get("category")), "%" + category.toLowerCase() + "%"));
        }
        if (startDate != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get("date"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.lessThanOrEqualTo(root.get("date"), endDate));
        }

        return transactionRepository.findAll(spec).stream()
                .map(TransactionDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
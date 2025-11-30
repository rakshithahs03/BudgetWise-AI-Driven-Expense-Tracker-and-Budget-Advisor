package org.budgetwise.backend.service;

import org.budgetwise.backend.dto.SavingGoalDTO;
import org.budgetwise.backend.model.SavingGoal;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.SavingGoalRepository;
import org.budgetwise.backend.repository.TransactionRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavingGoalService {

    private final SavingGoalRepository savingGoalRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public SavingGoalService(SavingGoalRepository savingGoalRepository, UserRepository userRepository, TransactionRepository transactionRepository) {
        this.savingGoalRepository = savingGoalRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional // ✅ Add this annotation
    public SavingGoalDTO createSavingGoal(int userId, SavingGoal savingGoal) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        savingGoal.setUser(user);

        // ✅ Calculate the initial saved amount from existing INCOME transactions
        BigDecimal totalSaved = transactionRepository.calculateTotalSavedForCategory(userId, savingGoal.getCategory());
        savingGoal.setSavedAmount(totalSaved.doubleValue());

        SavingGoal savedGoal = savingGoalRepository.save(savingGoal);
        return SavingGoalDTO.fromEntity(savedGoal);
    }

    public List<SavingGoalDTO> getSavingGoalsByUser(int userId) {
        return savingGoalRepository.findByUserId(userId)
                .stream()
                .map(SavingGoalDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public SavingGoalDTO updateSavingGoal(int goalId, SavingGoal updatedSavingGoal) {
        SavingGoal existing = savingGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Saving goal not found"));

        existing.setCategory(updatedSavingGoal.getCategory());
        existing.setTargetAmount(updatedSavingGoal.getTargetAmount());
        existing.setSavedAmount(updatedSavingGoal.getSavedAmount());
        existing.setDeadline(updatedSavingGoal.getDeadline());

        SavingGoal savedGoal = savingGoalRepository.save(existing);
        return SavingGoalDTO.fromEntity(savedGoal);
    }

    public void deleteSavingGoal(int goalId) {
        savingGoalRepository.deleteById(goalId);
    }
}
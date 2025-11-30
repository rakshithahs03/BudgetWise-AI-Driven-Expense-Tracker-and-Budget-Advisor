package org.budgetwise.backend.repository;

import org.budgetwise.backend.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Integer> {
    List<Budget> findByUserId(int userId);

    // ✅ Add this method to find a budget that covers a specific date
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.category = :category AND :date >= b.startDate AND :date <= b.endDate")
    Optional<Budget> findByUserIdAndCategoryAndDate(@Param("userId") int userId, @Param("category") String category, @Param("date") LocalDate date);

    // ✅ Add this method
    Optional<Budget> findByUserIdAndCategory(int userId, String category);
}
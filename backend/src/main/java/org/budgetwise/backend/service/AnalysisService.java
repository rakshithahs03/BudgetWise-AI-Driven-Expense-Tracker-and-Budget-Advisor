package org.budgetwise.backend.service;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.*;
import org.budgetwise.backend.model.Profile;
import org.budgetwise.backend.model.SavingGoal;
import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.model.TransactionType;
import org.budgetwise.backend.repository.ProfileRepository;
import org.budgetwise.backend.repository.SavingGoalRepository;
import org.budgetwise.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final TransactionRepository transactionRepository;
    private final SavingGoalRepository savingGoalRepository;
    private final ProfileRepository profileRepository;

    public ExpenseSummaryDTO getExpenseSummary(int userId, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Transaction> monthlyExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, endOfMonth
        );

        double totalSpend = monthlyExpenses.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double averageDailySpend = totalSpend / endOfMonth.getDayOfMonth();

        String highestSpendingCategory = monthlyExpenses.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        return new ExpenseSummaryDTO(totalSpend, averageDailySpend, highestSpendingCategory);
    }

    public List<CategorySpendingDTO> getExpenseByCategory(int userId, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());
        List<Transaction> monthlyExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, endOfMonth);

        return monthlyExpenses.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .map(entry -> new CategorySpendingDTO(entry.getKey(), entry.getValue().doubleValue()))
                .collect(Collectors.toList());
    }

    public ExpenseSummaryDTO getExpenseSummaryForCategory(int userId, String category, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Transaction> monthlyExpensesForCategory = transactionRepository
                .findByUserIdAndTypeAndCategoryAndDateBetween(userId, TransactionType.EXPENSE, category, startOfMonth, endOfMonth);

        double totalSpend = monthlyExpensesForCategory.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        long transactionCount = monthlyExpensesForCategory.size();
        double averageTransactionAmount = (transactionCount > 0)
                ? BigDecimal.valueOf(totalSpend / transactionCount).setScale(2, RoundingMode.HALF_UP).doubleValue()
                : 0;

        return new ExpenseSummaryDTO(totalSpend, averageTransactionAmount, category);
    }

    public IncomeSummaryDTO getIncomeSummary(int userId, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Transaction> monthlyIncome = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.INCOME, startOfMonth, endOfMonth
        );

        double totalIncome = monthlyIncome.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        String highestIncomeCategory = monthlyIncome.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        return new IncomeSummaryDTO(totalIncome, highestIncomeCategory);
    }

    public List<CategorySpendingDTO> getIncomeByCategory(int userId, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());
        List<Transaction> monthlyIncome = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.INCOME, startOfMonth, endOfMonth);

        return monthlyIncome.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .map(entry -> new CategorySpendingDTO(entry.getKey(), entry.getValue().doubleValue()))
                .collect(Collectors.toList());
    }

    public SavingsSummaryDTO getSavingsSummary(int userId, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Transaction> monthlySavings = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.SAVINGS, startOfMonth, endOfMonth
        );

        double totalSaved = monthlySavings.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        List<SavingGoal> goals = savingGoalRepository.findByUserId(userId);
        int goalsMet = (int) goals.stream().filter(g -> g.getSavedAmount() >= g.getTargetAmount()).count();
        int goalsInProgress = goals.size() - goalsMet;

        return new SavingsSummaryDTO(totalSaved, goalsMet, goalsInProgress);
    }

    public IncomeSummaryDTO getIncomeSummaryForCategory(int userId, String category, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Transaction> monthlyIncomeForCategory = transactionRepository.findByUserIdAndTypeAndCategoryAndDateBetween(
                userId, TransactionType.INCOME, category, startOfMonth, endOfMonth
        );

        double totalIncome = monthlyIncomeForCategory.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        return new IncomeSummaryDTO(totalIncome, category);
    }

    public CashFlowDTO getCashFlowSummary(int userId) {

        double monthlyIncome = profileRepository.findByUserId(userId)
                .map(Profile::getIncome)
                .orElse(0.0);


        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        List<Transaction> monthlyExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, today
        );
        double totalExpenses = monthlyExpenses.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();


        double moneyLeftToSpend = monthlyIncome - totalExpenses;

        return new CashFlowDTO(monthlyIncome, totalExpenses, moneyLeftToSpend);
    }

    public TrendDataDTO getIncomeVsExpenseTrend(int userId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusMonths(5).withDayOfMonth(1);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(userId, start, end);

        Map<String, Double> monthlyIncome = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .collect(Collectors.groupingBy(
                        t -> t.getDate().format(DateTimeFormatter.ofPattern("MMM")),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())
                ));

        Map<String, Double> monthlyExpenses = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        t -> t.getDate().format(DateTimeFormatter.ofPattern("MMM")),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())
                ));

        List<String> labels = new ArrayList<>();
        List<Double> incomeData = new ArrayList<>();
        List<Double> expenseData = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");

        for (int i = 5; i >= 0; i--) {
            String month = end.minusMonths(i).format(formatter);
            labels.add(month);
            incomeData.add(monthlyIncome.getOrDefault(month, 0.0));
            expenseData.add(monthlyExpenses.getOrDefault(month, 0.0));
        }

        return new TrendDataDTO(labels, incomeData, expenseData);
    }

    public List<CategorySpendingDTO> getTopExpenseCategories(int userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        List<Transaction> monthlyExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, today);

        return monthlyExpenses.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())) // Sort descending
                .limit(5) // Get the top 5
                .map(entry -> new CategorySpendingDTO(entry.getKey(), entry.getValue().doubleValue()))
                .collect(Collectors.toList());
    }

    public List<CategorySpendingDTO> getSavingsByCategory(int userId, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Transaction> savingsTransactions = transactionRepository.findByUserIdAndTypeAndDateBetween(userId, TransactionType.SAVINGS, startOfMonth, endOfMonth);

        return savingsTransactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())
                ))
                .entrySet().stream()
                .map(entry -> new CategorySpendingDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public Map<LocalDate, Double> getExpenseHeatMapData(int userId, int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Transaction> transactions = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, endOfMonth
        );

        return transactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getDate,
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())
                ));
    }

    public MultiDataSetTrendDTO getDailyExpenseTrendForCategories(int userId, int year, int month, List<String> categories) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Transaction> transactions = transactionRepository.findByUserIdAndTypeAndCategoryInAndDateBetween(
                userId, TransactionType.EXPENSE, categories, startOfMonth, endOfMonth
        );

        Map<String, Map<LocalDate, Double>> expensesByCategoryAndDay = transactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.groupingBy(
                                Transaction::getDate,
                                Collectors.summingDouble(t -> t.getAmount().doubleValue())
                        )
                ));

        List<String> labels = startOfMonth.datesUntil(endOfMonth.plusDays(1))
                .map(date -> date.format(DateTimeFormatter.ofPattern("d MMM")))
                .collect(Collectors.toList());

        List<DataSet> datasets = new ArrayList<>();
        for (String category : categories) {
            Map<LocalDate, Double> dailyTotals = expensesByCategoryAndDay.getOrDefault(category, Collections.emptyMap());
            List<Double> data = new ArrayList<>();
            for (LocalDate date = startOfMonth; !date.isAfter(endOfMonth); date = date.plusDays(1)) {
                data.add(dailyTotals.getOrDefault(date, 0.0));
            }
            datasets.add(new DataSet(category, data));
        }

        return new MultiDataSetTrendDTO(labels, datasets);
    }

    public MonthlySummaryDTO getMonthlySummary(int userId) {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();

        IncomeSummaryDTO incomeSummary = getIncomeSummary(userId, year, month);
        ExpenseSummaryDTO expenseSummary = getExpenseSummary(userId, year, month);
        List<CategorySpendingDTO> topCategories = getTopExpenseCategories(userId);
        TrendDataDTO trend = getIncomeVsExpenseTrend(userId);

        double netSavings = incomeSummary.getTotalIncomeThisMonth() - expenseSummary.getTotalSpendThisMonth();

        return MonthlySummaryDTO.builder()
                .totalIncome(incomeSummary.getTotalIncomeThisMonth())
                .totalExpenses(expenseSummary.getTotalSpendThisMonth())
                .netSavings(netSavings)
                .topSpendingCategories(topCategories)
                .incomeVsExpenseTrend(trend)
                .build();
    }
}
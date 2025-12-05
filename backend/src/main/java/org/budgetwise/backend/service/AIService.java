package org.budgetwise.backend.service;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.*;
import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.model.TransactionType;
import org.budgetwise.backend.repository.TransactionRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIService {

    private final ChatClient chatClient;
    private final AnalysisService analysisService;
    private final TransactionRepository transactionRepository;


    public String ask(String prompt){
        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }


    public List<String> generateSuggestions(int userId) {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();

        List<CategorySpendingDTO> topExpenses = analysisService.getExpenseByCategory(userId, year, month);
        LocalDate startOfMonth = today.withDayOfMonth(1);
        List<Transaction> monthlyExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, today
        );
        double totalSpend = monthlyExpenses.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        String financialContext = topExpenses.stream()
                .map(expense -> String.format("- Spent %.2f in %s", expense.getTotalAmount(), expense.getCategory()))
                .collect(Collectors.joining("\n"));
        financialContext += String.format("\n- Total monthly spend was %.2f.", totalSpend);


        String prompt = """
                You are a friendly financial advisor named BudgetWise.
                Based on the user's spending data below, provide 2-3 short, actionable, and encouraging financial tips.
                Do not be judgmental. Each tip must be a complete sentence and start with a bullet point (*).

                User's spending data:
                %s
                """.formatted(financialContext);


        String llmResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return Arrays.stream(llmResponse.split("\\*"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public String getChatResponse(int userId, String userPrompt) {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();

        ExpenseSummaryDTO expenseSummary = analysisService.getExpenseSummary(userId, year, month);
        IncomeSummaryDTO incomeSummary = analysisService.getIncomeSummary(userId, year, month);
        SavingsSummaryDTO savingsSummary = analysisService.getSavingsSummary(userId, year, month);
        CashFlowDTO cashFlow = analysisService.getCashFlowSummary(userId);
        List<CategorySpendingDTO> topExpenses = analysisService.getTopExpenseCategories(userId);

        String financialContext = String.format(
                """
                Here is a summary of the user's financial data for the current month(all in rupees):
                - Total Income: %.2f
                - Total Expenses: %.2f
                - Total Saved this Month: %.2f
                - Money Left to Spend: %.2f
                - Highest Spending Category: %s
                - Top 5 Spending Categories: %s
                """,
                incomeSummary.getTotalIncomeThisMonth(),
                expenseSummary.getTotalSpendThisMonth(),
                savingsSummary.getTotalSavedThisMonth(),
                cashFlow.getMoneyLeftToSpend(),
                expenseSummary.getHighestSpendingCategory(),
                topExpenses.stream()
                        .map(c -> String.format("%s (%.2f)", c.getCategory(), c.getTotalAmount()))
                        .collect(Collectors.joining(", "))
        );

        String finalPrompt = String.format(
                """
                You are BudgetWise, a friendly and helpful financial AI assistant.
                Your goal is to provide short, clear, encouraging, and easy-to-understand answers based on the user's financial data.

                **Formatting Rules:**
                - Use **Markdown** for all responses.
                - Use bullet points (`*`) for lists or key points.
                - Use bold text (`**...**`) to highlight important numbers, categories, and summaries.
                - Keep sentences short and to the point.
                - Use emojis (like 💰, 📈, 💡) to make the advice more engaging.

                **Your Task:**
                Analyze the user's financial data below and answer their question following the formatting rules.

                **User's Financial Data:(all in rupees)**
                %s

                **User's Question:**
                "%s"
                """,
                financialContext,
                userPrompt
        );

        return chatClient.prompt()
                .user(finalPrompt)
                .call()
                .content();
    }
}
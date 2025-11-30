package org.budgetwise.backend.controller;

import org.budgetwise.backend.dto.TransactionDTO;
import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.model.TransactionType;
import org.budgetwise.backend.service.TransactionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<TransactionDTO> addTransaction(
            @PathVariable int userId,
            @RequestBody Transaction transaction
    ) {
        return ResponseEntity.ok(transactionService.addTransaction(userId, transaction));
    }

    @PostMapping("/import/{userId}")
    public ResponseEntity<Void> importTransactions(@PathVariable int userId, @RequestBody List<Transaction> transactions) {
        transactionService.importTransactions(userId, transactions);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> editTransaction(
            @PathVariable int id,
            @RequestBody Transaction updatedTransaction
    ) {
        return ResponseEntity.ok(transactionService.editTransaction(id, updatedTransaction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable int id) {
        transactionService.deleteTransaction(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // ✅ Use 204 No Content
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(transactionService.getTransactionsByUser(userId));
    }

    @GetMapping("/{userId}/category")
    public ResponseEntity<List<String>> getCategories(@PathVariable int userId){
        return ResponseEntity.ok(transactionService.getCategories(userId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TransactionDTO>> getFilteredTransactions(
            @RequestParam int userId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TransactionDTO> transactions = transactionService.getFilteredTransactions(userId, type, category, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

}
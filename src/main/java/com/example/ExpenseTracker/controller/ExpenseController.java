package com.example.ExpenseTracker.controller;

import com.example.ExpenseTracker.entity.Expense;
import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.repository.ExpenseRepository;
import com.example.ExpenseTracker.repository.UserRepository;
import com.example.ExpenseTracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepo;

    @Autowired
    public ExpenseController(ExpenseService expenseService, UserRepository userRepo, ExpenseRepository expenseRepo) {
        this.expenseService = expenseService;
        this.userRepo = userRepo;
    }

    // ➤ Add new expense
    @PostMapping("/addExpense")
    public ResponseEntity<?> addExpense(@RequestBody Expense expense) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found");

        expense.setUser(user);

        // ✅ Set date automatically if not provided
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }

        Expense savedExpense = expenseService.addExpense(expense);

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedExpense.getId());
        response.put("description", savedExpense.getDescription());
        response.put("amount", savedExpense.getAmount());
        response.put("username", user.getUsername());
        response.put("date", savedExpense.getDate());

        return ResponseEntity.ok(response);
    }


    // ➤ Get all expenses
    @GetMapping("/getExpense")
    public ResponseEntity<List<Map<String, Object>>> getUserExpenses() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found");

        List<Expense> expenses = expenseService.getExpensesByUser(user);

        List<Map<String, Object>> response = expenses.stream().map(exp -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", exp.getId());
            map.put("description", exp.getDescription());
            map.put("amount", exp.getAmount());
            map.put("username", user.getUsername());
            map.put("date", exp.getDate());
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    // ➤ Update expense
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found");

        Expense expense = expenseService.getExpenseByIdAndUser(id, user);
        expense.setDescription(expenseDetails.getDescription());
        expense.setAmount(expenseDetails.getAmount());
        expense.setDate(expenseDetails.getDate());

        Expense updatedExpense = expenseService.addExpense(expense);

        Map<String, Object> response = new HashMap<>();
        response.put("id", updatedExpense.getId());
        response.put("description", updatedExpense.getDescription());
        response.put("amount", updatedExpense.getAmount());
        response.put("username", user.getUsername());
        response.put("date", updatedExpense.getDate());

        return ResponseEntity.ok(response);
    }

    // ➤ Delete expense
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found");

        Expense expense = expenseService.getExpenseByIdAndUser(id, user);
        expenseService.deleteExpense(expense);

        return "Expense deleted successfully!";
    }

}


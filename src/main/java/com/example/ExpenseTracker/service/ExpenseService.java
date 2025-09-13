package com.example.ExpenseTracker.service;

import com.example.ExpenseTracker.entity.Expense;
import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepo;

    public ExpenseService(ExpenseRepository expenseRepo) {
        this.expenseRepo = expenseRepo;
    }

    public Expense addExpense(Expense expense) {
        return expenseRepo.save(expense);
    }

    public List<Expense> getExpensesByUser(User user) {
        return expenseRepo.findByUser(user);
    }

    public Expense getExpenseByIdAndUser(Long id, User user) {
        return expenseRepo.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));
    }

    public void deleteExpense(Expense expense) {
        expenseRepo.delete(expense);
    }
}

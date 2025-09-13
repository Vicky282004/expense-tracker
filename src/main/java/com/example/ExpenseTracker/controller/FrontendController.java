package com.example.ExpenseTracker.controller;

import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.repository.UserRepository;
import com.example.ExpenseTracker.service.ExpenseService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {
    private final ExpenseService expenseService;
    private final UserRepository userRepo;

    public FrontendController(ExpenseService expenseService, UserRepository userRepo) {
        this.expenseService = expenseService;
        this.userRepo = userRepo;
    }

    // Show expense list page
    @GetMapping("/expensesPage")
    public String getExpensesPage(Model model) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found");

        model.addAttribute("expenses", expenseService.getExpensesByUser(user));
        model.addAttribute("username", username);
        return "expenses"; // T   }
    }
}

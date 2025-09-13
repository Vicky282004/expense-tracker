package com.example.ExpenseTracker.repository;

import com.example.ExpenseTracker.entity.Expense;
import com.example.ExpenseTracker.entity.User;   // ✅ correct import
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    Optional<Expense> findByIdAndUser(Long id, User user);
}


package com.example.ExpenseTracker.repository;

import com.example.ExpenseTracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // UserRepository.java
    User findByUsername(String username);

}

package com.example.ExpenseTracker.controller;





import com.example.ExpenseTracker.entity.User;
import com.example.ExpenseTracker.service.UserService;
import com.example.ExpenseTracker.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authManager;

    // Register new user
    @PostMapping("/signup")
    public String register(@RequestBody User user) {
        userService.registerUser(user);
        return "User registered successfully!";
    }

    // Login and get JWT token
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
        } catch (AuthenticationException e) {
            return "Invalid credentials!";
        }
        return jwtUtil.generateToken(user.getUsername());
    }

}

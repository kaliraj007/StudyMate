package com.studymate.controller;

import com.studymate.model.User;
import com.studymate.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ================================
    // REGISTER
    // ================================

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {

        User registeredUser =
                userService.registerUser(user);

        if (registeredUser == null) {

            return null;
        }

        return registeredUser;
    }


    // ================================
    // LOGIN
    // ================================

    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {

        return userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );
    }
}
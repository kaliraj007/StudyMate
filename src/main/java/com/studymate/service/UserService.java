package com.studymate.service;

import com.studymate.model.User;
import com.studymate.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register a new user
    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return null;
        }

        return userRepository.save(user);
    }

    // Login user
    public User loginUser(String email, String password) {

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isPresent()) {

            User existingUser = user.get();

            if (existingUser.getPassword().equals(password)) {
                return existingUser;
            }
        }

        return null;
    }
}
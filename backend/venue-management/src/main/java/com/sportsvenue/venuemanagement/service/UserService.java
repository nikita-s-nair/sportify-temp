package com.sportsvenue.venuemanagement.service;

import com.sportsvenue.venuemanagement.model.User;
import com.sportsvenue.venuemanagement.repository.UserRepository;
import com.sportsvenue.venuemanagement.dto.LoginRequest;
import com.sportsvenue.venuemanagement.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        try {
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        } catch (Exception e) {
            throw new RuntimeException("Error finding user by username: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        try {
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        } catch (Exception e) {
            throw new RuntimeException("Error finding user by email: " + e.getMessage());
        }
    }

    @Transactional
    public User createUser(User user) {
        try {
            // Check if username exists
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                throw new RuntimeException("Username already exists");
            }

            // Check if email exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists");
            }

            // Validate role
            validateRole(user.getRole());

            // Encode password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            return userRepository.save(user);
        } catch (RuntimeException e) {
            throw e; // Re-throw our custom exceptions
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e.getMessage());
        }
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            // Check if new username exists (if changed)
            if (!user.getUsername().equals(userDetails.getUsername()) &&
                userRepository.findByUsername(userDetails.getUsername()).isPresent()) {
                throw new RuntimeException("Username already exists");
            }

            // Check if new email exists (if changed)
            if (!user.getEmail().equals(userDetails.getEmail()) &&
                userRepository.findByEmail(userDetails.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists");
            }

            // Validate role
            validateRole(userDetails.getRole());

            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            
            // Only update password if provided
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }

            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error updating user: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        try {
            if (!userRepository.existsById(id)) {
                throw new RuntimeException("User not found with id: " + id);
            }
            userRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<User> getUsersByRole(String role) {
        try {
            validateRole(role);
            return userRepository.findByRole(role);
        } catch (Exception e) {
            throw new RuntimeException("Error finding users by role: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseEntity<?> login(LoginRequest loginRequest) {
        try {
            // First check if user exists
            if (!userRepository.findByUsername(loginRequest.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
            }

            try {
                Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                    )
                );

                User user = getUserByUsername(loginRequest.getUsername());
                String token = jwtUtil.generateToken(user.getUsername());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("username", user.getUsername());
                response.put("role", user.getRole());

                return ResponseEntity.ok(response);
            } catch (BadCredentialsException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "An error occurred during login"));
        }
    }

    @Transactional
    public void changePassword(Long id, String currentPassword, String newPassword) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error changing password: " + e.getMessage());
        }
    }

    private void validateRole(String role) {
        try {
            User.Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            String validRoles = java.util.Arrays.stream(User.Role.values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new RuntimeException("Invalid role: " + role + ". Valid roles are: " + validRoles);
        }
    }
}

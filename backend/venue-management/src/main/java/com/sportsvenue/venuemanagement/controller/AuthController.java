package com.sportsvenue.venuemanagement.controller;

import com.sportsvenue.venuemanagement.dto.LoginRequest;
import com.sportsvenue.venuemanagement.dto.LoginResponse;
import com.sportsvenue.venuemanagement.dto.SignupRequest;
import com.sportsvenue.venuemanagement.model.User;
import com.sportsvenue.venuemanagement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return success(authService.login(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignupRequest request) {
        return success(authService.signup(request));
    }
}

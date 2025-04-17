package com.sportsvenue.venuemanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

/**
 * Base controller class that provides common functionality and CORS configuration
 * for all controllers in the application.
 * 
 * This class:
 * 1. Provides CORS configuration for all endpoints
 * 2. Serves as a base for all controllers
 * 3. Can be extended to add more common functionality
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173", 
    allowedHeaders = {"Authorization", "Content-Type", "X-Requested-With", "Accept"},
    exposedHeaders = {"Authorization"},
    methods = {org.springframework.web.bind.annotation.RequestMethod.GET,
              org.springframework.web.bind.annotation.RequestMethod.POST,
              org.springframework.web.bind.annotation.RequestMethod.PUT,
              org.springframework.web.bind.annotation.RequestMethod.DELETE,
              org.springframework.web.bind.annotation.RequestMethod.OPTIONS,
              org.springframework.web.bind.annotation.RequestMethod.PATCH},
    allowCredentials = "true",
    maxAge = 3600)
public class BaseController {
    
    /**
     * Helper method to create a successful response with the given data
     * @param data The data to include in the response
     * @return ResponseEntity with the data
     */
    protected <T> ResponseEntity<T> success(T data) {
        return ResponseEntity.ok(data);
    }

    /**
     * Helper method to create a not found response
     * @return ResponseEntity with 404 status
     */
    protected <T> ResponseEntity<T> notFound() {
        return ResponseEntity.notFound().build();
    }

    /**
     * Helper method to create a bad request response with the given message
     * @param message The error message
     * @return ResponseEntity with 400 status and the message
     */
    protected ResponseEntity<String> badRequest(String message) {
        return ResponseEntity.badRequest().body(message);
    }

    /**
     * Helper method to create an unauthorized response
     * @return ResponseEntity with 401 status
     */
    protected <T> ResponseEntity<T> unauthorized() {
        return ResponseEntity.status(401).build();
    }

    /**
     * Helper method to create a forbidden response
     * @return ResponseEntity with 403 status
     */
    protected <T> ResponseEntity<T> forbidden() {
        return ResponseEntity.status(403).build();
    }
} 
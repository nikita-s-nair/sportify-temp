package com.sportsvenue.venuemanagement.controller;

import com.sportsvenue.venuemanagement.model.*;
import com.sportsvenue.venuemanagement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController extends BaseController {

    @Autowired
    private AdminService adminService;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return success(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return success(adminService.getUserById(id));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        return success(adminService.updateUserRole(id, role));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return success(null);
    }

    @PostMapping("/users/admin")
    public ResponseEntity<User> createAdminUser(@RequestBody User user) {
        return success(adminService.createAdminUser(user));
    }

    // Analytics
    @GetMapping("/analytics/users")
    public ResponseEntity<Map<String, Object>> getUserAnalytics() {
        return success(adminService.getUserAnalytics());
    }

    @GetMapping("/analytics/venues")
    public ResponseEntity<Map<String, Object>> getVenueAnalytics() {
        return success(adminService.getVenueAnalytics());
    }

    @GetMapping("/analytics/bookings")
    public ResponseEntity<Map<String, Object>> getBookingAnalytics() {
        return success(adminService.getBookingAnalytics());
    }

    // Venue Management
    @GetMapping("/venues")
    public ResponseEntity<List<Venue>> getAllVenues() {
        return success(adminService.getAllVenues());
    }

    @GetMapping("/venues/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        return success(adminService.getVenueById(id));
    }

    @PostMapping("/venues")
    public ResponseEntity<Venue> createVenue(@RequestBody Venue venue) {
        return success(adminService.createVenue(venue));
    }

    @PutMapping("/venues/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @RequestBody Venue venue) {
        return success(adminService.updateVenue(id, venue));
    }

    @DeleteMapping("/venues/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        adminService.deleteVenue(id);
        return success(null);
    }

    // Booking Management
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return success(adminService.getAllBookings());
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return success(adminService.getBookingById(id));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return success(adminService.updateBookingStatus(id, status));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        adminService.deleteBooking(id);
        return success(null);
    }

    // Financial Management
    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return success(adminService.getAllPayments());
    }

    @GetMapping("/payments/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return success(adminService.getPaymentById(id));
    }

    @GetMapping("/revenue/report")
    public ResponseEntity<Map<String, Object>> getRevenueReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return success(adminService.getRevenueReport(startDate, endDate));
    }

    @GetMapping("/payments/analytics")
    public ResponseEntity<Map<String, Object>> getPaymentAnalytics() {
        return success(adminService.getPaymentAnalytics());
    }

    // System Settings
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSystemSettings() {
        return success(adminService.getSystemSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<Void> updateSystemSettings(@RequestBody Map<String, String> settings) {
        adminService.updateSystemSettings(settings);
        return success(null);
    }

} 
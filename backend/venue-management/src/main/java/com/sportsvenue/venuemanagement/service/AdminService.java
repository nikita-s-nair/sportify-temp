package com.sportsvenue.venuemanagement.service;

import com.sportsvenue.venuemanagement.model.*;
import java.util.List;
import java.util.Map;

public interface AdminService {
    // User Management
    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUserRole(Long id, String role);
    void deleteUser(Long id);
    User createAdminUser(User user);

    // Analytics
    Map<String, Object> getUserAnalytics();
    Map<String, Object> getVenueAnalytics();
    Map<String, Object> getBookingAnalytics();
    Map<String, Object> getFinancialAnalytics();

    // Venue Management
    List<Venue> getAllVenues();
    Venue getVenueById(Long id);
    Venue createVenue(Venue venue);
    Venue updateVenue(Long id, Venue venue);
    void deleteVenue(Long id);

    // Booking Management
    List<Booking> getAllBookings();
    Booking getBookingById(Long id);
    Booking updateBookingStatus(Long id, String status);
    void deleteBooking(Long id);

    // Financial Management
    List<Payment> getAllPayments();
    Payment getPaymentById(Long id);
    Map<String, Object> getRevenueReport(String startDate, String endDate);
    Map<String, Object> getPaymentAnalytics();

    // System Settings
    Map<String, Object> getSystemSettings();
    void updateSystemSettings(Map<String, String> settings);
} 
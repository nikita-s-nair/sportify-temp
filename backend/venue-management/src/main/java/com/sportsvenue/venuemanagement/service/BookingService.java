package com.sportsvenue.venuemanagement.service;

import com.sportsvenue.venuemanagement.model.Booking;
import com.sportsvenue.venuemanagement.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public interface BookingService {
    List<Booking> getAllBookings();
    
    Map<String, Object> getAdminBookingStats();
    
    Map<String, Object> getManagerBookingStats();
    
    List<Booking> getManagerBookings(Long managerId);
    
    List<Booking> getUserBookings(Long userId);
    
    List<Booking> getUserBookingsByUsername(String username);
    
    List<Booking> getVenueBookings(Long venueId, LocalDate date);
    
    Booking createBooking(Long venueId, Long userId, LocalDate bookingDate,
                         LocalTime startTime, LocalTime endTime, Integer courtNumber,
                         Double totalAmount);
    
    Booking updateBookingStatus(Long bookingId, BookingStatus status);
    
    void updatePaymentInfo(Long bookingId, String paymentId);
    
    void cancelBooking(Long bookingId);
    
    boolean isCourtAvailable(Long venueId, LocalDate date, LocalTime startTime,
                           LocalTime endTime, Integer courtNumber);
    
    Booking getBookingById(Long bookingId);
} 
package com.sportsvenue.venuemanagement.controller;

import com.sportsvenue.venuemanagement.model.Booking;
import com.sportsvenue.venuemanagement.model.BookingStatus;
import com.sportsvenue.venuemanagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/admin/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        return ResponseEntity.ok(bookingService.getAdminBookingStats());
    }

    @GetMapping("/manager/stats")
    public ResponseEntity<Map<String, Object>> getManagerStats() {
        return ResponseEntity.ok(bookingService.getManagerBookingStats());
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<Booking>> getManagerBookings(@PathVariable Long managerId) {
        return ResponseEntity.ok(bookingService.getManagerBookings(managerId));
    }

    @GetMapping("/user/id/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/user/name/{username}")
    public ResponseEntity<List<Booking>> getUserBookingsByUsername(@PathVariable String username) {
        return ResponseEntity.ok(bookingService.getUserBookingsByUsername(username));
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<Booking>> getVenueBookings(
            @PathVariable Long venueId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(bookingService.getVenueBookings(venueId, date));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(
            request.getVenueId(),
            request.getUserId(),
            request.getBookingDate(),
            request.getStartTime(),
            request.getEndTime(),
            request.getCourtNumber(),
            request.getTotalAmount()
        );
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<Void> updatePaymentInfo(
            @PathVariable Long id,
            @RequestParam String paymentId) {
        bookingService.updatePaymentInfo(id, paymentId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/available")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long venueId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @RequestParam Integer courtNumber) {
        return ResponseEntity.ok(bookingService.isCourtAvailable(venueId, date, startTime, endTime, courtNumber));
    }
}

class BookingRequest {
    private Long venueId;
    private Long userId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer courtNumber;
    private Double totalAmount;

    // Getters and Setters
    public Long getVenueId() { return venueId; }
    public void setVenueId(Long venueId) { this.venueId = venueId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public Integer getCourtNumber() { return courtNumber; }
    public void setCourtNumber(Integer courtNumber) { this.courtNumber = courtNumber; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
}

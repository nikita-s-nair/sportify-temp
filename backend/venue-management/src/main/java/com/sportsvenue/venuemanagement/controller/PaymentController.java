package com.sportsvenue.venuemanagement.controller;

import com.sportsvenue.venuemanagement.model.Payment;
import com.sportsvenue.venuemanagement.service.PaymentService;
import com.sportsvenue.venuemanagement.dto.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController extends BaseController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
        try {
            Payment payment = paymentService.processPayment(
                    request.getBookingId(),
                    request.getAmount(),
                    request.getMethod(),
                    request.getStatus(),
                    request.getPaymentDate(),
                    request.getPaymentMethod(),
                    request.getTransactionId());

            // Create a simplified response to avoid serialization issues
            return ResponseEntity.ok(Map.of(
                    "id", payment.getId(),
                    "amount", payment.getAmount(),
                    "method", payment.getMethod(),
                    "status", payment.getStatus(),
                    "paymentMethod", payment.getPaymentMethod(),
                    "transactionId", payment.getTransactionId(),
                    "bookingId", payment.getBooking().getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBookingId(@PathVariable Long bookingId) {
        try {
            Payment payment = paymentService.getPaymentByBookingId(bookingId);
            if (payment == null) {
                return ResponseEntity.notFound().build();
            }

            // Create a simplified response to avoid serialization issues
            return ResponseEntity.ok(Map.of(
                    "id", payment.getId(),
                    "amount", payment.getAmount(),
                    "method", payment.getMethod(),
                    "status", payment.getStatus(),
                    "paymentMethod", payment.getPaymentMethod(),
                    "transactionId", payment.getTransactionId(),
                    "bookingId", payment.getBooking().getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
package com.sportsvenue.venuemanagement.controller;

import com.sportsvenue.venuemanagement.model.Payment;
import com.sportsvenue.venuemanagement.service.PaymentService;
import com.sportsvenue.venuemanagement.dto.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController extends BaseController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody PaymentRequest request) {
        Payment payment = paymentService.processPayment(
                request.getBookingId(),
                request.getAmount(),
                request.getPaymentMethod(),
                request.getCardNumber(),
                request.getExpiryDate(),
                request.getCvv());
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBookingId(@PathVariable Long bookingId) {
        Payment payment = paymentService.getPaymentByBookingId(bookingId);
        return ResponseEntity.ok(payment);
    }
}
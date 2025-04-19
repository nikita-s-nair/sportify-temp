package com.sportsvenue.venuemanagement.service;

import com.sportsvenue.venuemanagement.model.Payment;

public interface PaymentService {
    Payment processPayment(Long bookingId, Double amount, String method, String status,
            String paymentDate, String paymentMethod, String transactionId);

    Payment getPaymentByBookingId(Long bookingId);
}
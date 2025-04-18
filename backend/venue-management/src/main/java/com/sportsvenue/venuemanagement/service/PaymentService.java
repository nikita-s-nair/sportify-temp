package com.sportsvenue.venuemanagement.service;

import com.sportsvenue.venuemanagement.model.Payment;

public interface PaymentService {
    Payment processPayment(Long bookingId, Double amount, String paymentMethod,
            String cardNumber, String expiryDate, String cvv);

    Payment getPaymentByBookingId(Long bookingId);
}
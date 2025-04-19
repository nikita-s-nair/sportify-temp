package com.sportsvenue.venuemanagement.service.impl;

import com.sportsvenue.venuemanagement.model.Booking;
import com.sportsvenue.venuemanagement.model.BookingStatus;
import com.sportsvenue.venuemanagement.model.Payment;
import com.sportsvenue.venuemanagement.repository.BookingRepository;
import com.sportsvenue.venuemanagement.repository.PaymentRepository;
import com.sportsvenue.venuemanagement.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository,
            BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Payment processPayment(Long bookingId, Double amount, String method, String status,
            String paymentDate, String paymentMethod, String transactionId) {
        // Get the booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        // Verify amount matches booking amount
        if (!booking.getTotalAmount().equals(amount)) {
            throw new IllegalArgumentException("Payment amount does not match booking amount");
        }

        // Create payment record
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(amount);
        payment.setMethod(method);
        payment.setStatus(status);

        // Handle date parsing with proper error handling
        try {
            // Try to parse the ISO date format
            payment.setPaymentDate(LocalDateTime.parse(paymentDate));
        } catch (DateTimeParseException e) {
            // If parsing fails, use current date
            payment.setPaymentDate(LocalDateTime.now());
        }

        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId(transactionId);

        // Save payment
        Payment savedPayment = paymentRepository.save(payment);

        // Update booking status
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return savedPayment;
    }

    @Override
    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}
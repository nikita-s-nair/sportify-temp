import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, isLoggedIn, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Format the payment data according to the actual database schema
      const paymentData = {
        bookingId: parseInt(booking.id),
        amount: parseFloat(booking.totalAmount),
        method: paymentMethod,
        status: 'COMPLETED',
        // Format the date in a way that can be parsed by Java's LocalDateTime
        paymentDate: new Date().toISOString().replace('Z', ''),
        paymentMethod: paymentMethod,
        transactionId: 'TXN' + Date.now() + Math.floor(Math.random() * 1000)
      };

      console.log('Submitting payment data:', paymentData);
      
      // First create the payment
      const response = await api.post('/payments', paymentData);
      console.log('Payment response:', response.data);
      
      // Then update the booking status
      await api.put(`/bookings/${booking.id}/status?status=CONFIRMED`);
      
      toast.success('Payment successful! Your booking has been confirmed.');
      navigate('/my-bookings');
    } catch (err) {
      console.error('Payment error:', err);
      // Check if the error response has a specific message
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Payment failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Booking not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Booking Summary</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Venue: {booking.venue.name}</p>
            <p className="text-gray-600">Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p className="text-gray-600">Time: {booking.startTime} - {booking.endTime}</p>
            <p className="text-gray-600">Court: {booking.courtNumber}</p>
            <p className="text-gray-600 font-semibold">Total Amount: ${booking.totalAmount}</p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isProcessing ? 'Processing Payment...' : 'Make Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user, userId, isLoggedIn, isLoading } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [courtNumber, setCourtNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check auth status and redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login', { state: { from: `/venues/${venueId}/book` } });
    }
  }, [isLoading, isLoggedIn, navigate, venueId]);

  // Fetch venue details
  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!venueId) {
        setError('Invalid venue ID');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/venues/${venueId}`);
        if (!response.data) {
          throw new Error('Venue not found');
        }
        setVenue(response.data);
      } catch (err) {
        console.error('Error fetching venue:', err);
        setError(err.response?.data?.message || 'Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isLoggedIn) {
      fetchVenueDetails();
    }
  }, [venueId, isLoading, isLoggedIn]);

  // Calculate total amount
  useEffect(() => {
    if (venue && bookingDate && startTime && endTime) {
      const start = new Date(`${bookingDate.toISOString().split('T')[0]}T${startTime}`);
      const end = new Date(`${bookingDate.toISOString().split('T')[0]}T${endTime}`);
      const hours = Math.max(0, (end - start) / (1000 * 60 * 60));
      const amount = hours * venue.pricePerHour;
      setTotalAmount(amount);
    }
  }, [venue, bookingDate, startTime, endTime]);

  const formatDate = (date) => {
    console.log('Formatting date input:', date);
    const formatted = date.toISOString().split('T')[0];
    console.log('Formatted date output:', formatted);
    return formatted;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Raw booking date:', bookingDate);
    
    // Validate user is logged in
    if (!isLoggedIn || !userId) {
      navigate('/login', { state: { from: `/venues/${venueId}/book` } });
      return;
    }

    // Validate venue exists
    if (!venueId || !venue) {
      toast.error('Invalid venue information');
      return;
    }

    // Validate form fields
    if (!bookingDate || !startTime || !endTime || !courtNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    // Format times to remove seconds
    const formatTime = (time) => time.split(':').slice(0, 2).join(':');
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    // Validate time range
    const start = new Date(`${formatDate(bookingDate)}T${formattedStartTime}`);
    const end = new Date(`${formatDate(bookingDate)}T${formattedEndTime}`);

    if (start >= end) {
      toast.error('End time must be after start time');
      return;
    }

    setIsSubmitting(true);

    try {
      // First check if the court is available
      const availabilityResponse = await api.get('/bookings/available', {
        params: {
          venueId: parseInt(venueId),
          date: formatDate(bookingDate),
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          courtNumber: parseInt(courtNumber)
        }
      });

      if (!availabilityResponse.data) {
        toast.error('This time slot is no longer available. Please select a different time or court.');
        setIsSubmitting(false);
        return;
      }

      // Create booking data
      const bookingData = {
        venueId: parseInt(venueId),
        userId: parseInt(userId),
        bookingDate: formatDate(bookingDate),
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        courtNumber: parseInt(courtNumber),
        totalAmount: parseFloat(totalAmount)
      };

      console.log('Submitting booking data:', bookingData);
      
      // Submit booking
      const response = await api.post('/bookings', bookingData);
      console.log('Booking response:', response.data);
      
      // Navigate to payment page with the booking ID
      navigate(`/payment/${response.data.id}`);
    } catch (err) {
      console.error('Error creating booking:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to create booking. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  // Show loading state while auth is initializing
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
  }

  // Don't show error message, just redirect if not logged in
  if (!isLoggedIn || !userId) {
    return null;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>;
  }

  if (!venue) {
    return <div className="max-w-4xl mx-auto p-6">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        Venue not found
      </div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Book {venue.name}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Venue Details</h2>
          <p className="text-gray-600">{venue.description}</p>
          <p className="text-gray-600 mt-2">Price per hour: ${venue.pricePerHour}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <DatePicker
              selected={bookingDate}
              onChange={(date) => setBookingDate(date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Court Number</label>
            <select
              value={courtNumber}
              onChange={(e) => setCourtNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a court</option>
              {[...Array(venue.numberOfCourts)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  Court {index + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
            <p className="text-gray-600">Date: {formatDate(bookingDate)}</p>
            <p className="text-gray-600">Total Amount: ${totalAmount.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Booking...' : 'Create Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage; 
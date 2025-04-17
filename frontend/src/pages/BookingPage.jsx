import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, username } = useAuth();
  
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking form state
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [courtNumber, setCourtNumber] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch venue details
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await api.get(`/venues/${venueId}`);
        setVenue(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching venue:', err);
        setError('Failed to load venue details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchVenue();
  }, [venueId]);
  
  // Calculate total amount when booking details change
  useEffect(() => {
    if (venue && startTime && endTime) {
      // Calculate hours between start and end time
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diffHours = (end - start) / (1000 * 60 * 60);
      
      if (diffHours > 0) {
        setTotalAmount(diffHours * venue.pricePerHour);
      } else {
        setTotalAmount(0);
      }
    }
  }, [venue, startTime, endTime]);
  
  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to book a venue');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('Please log in to book a venue');
      navigate('/login');
      return;
    }
    
    if (!startTime || !endTime) {
      toast.error('Please select start and end times');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = bookingDate.toISOString().split('T')[0];
      
      // Create booking request
      const bookingData = {
        venueId: parseInt(venueId),
        bookingDate: formattedDate,
        startTime: startTime,
        endTime: endTime,
        courtNumber: courtNumber,
        totalAmount: totalAmount
      };
      
      // Submit booking
      const response = await api.post('/bookings', bookingData);
      
      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating booking:', err);
      
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data || 'Invalid booking details');
      } else if (err.response && err.response.status === 409) {
        toast.error('This court is already booked for the selected time');
      } else {
        toast.error('Failed to create booking. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }
  
  if (!venue) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-xl">Venue not found</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Book {venue.name}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Venue Details</h2>
            <p className="text-gray-600 mb-2"><span className="font-medium">Location:</span> {venue.location}</p>
            <p className="text-gray-600 mb-2"><span className="font-medium">Sport Type:</span> {venue.sportType}</p>
            <p className="text-gray-600 mb-2"><span className="font-medium">Available Courts:</span> {venue.totalCourts}</p>
            <p className="text-gray-600 mb-2"><span className="font-medium">Price:</span> ${venue.pricePerHour}/hour</p>
            <p className="text-gray-600 mb-4"><span className="font-medium">Description:</span> {venue.description}</p>
          </div>
          
          <div>
            {venue.imageUrl && (
              <img 
                src={venue.imageUrl} 
                alt={venue.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Booking Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Booking Date</label>
              <DatePicker
                selected={bookingDate}
                onChange={date => setBookingDate(date)}
                minDate={new Date()}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="MMMM d, yyyy"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Court Number</label>
              <select
                value={courtNumber}
                onChange={e => setCourtNumber(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {[...Array(venue.totalCourts)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Court {i + 1}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
            <p className="text-gray-600 mb-2"><span className="font-medium">Date:</span> {bookingDate.toLocaleDateString()}</p>
            <p className="text-gray-600 mb-2"><span className="font-medium">Time:</span> {startTime} - {endTime}</p>
            <p className="text-gray-600 mb-2"><span className="font-medium">Court:</span> {courtNumber}</p>
            <p className="text-gray-600 mb-2"><span className="font-medium">Total Amount:</span> ${totalAmount.toFixed(2)}</p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage; 
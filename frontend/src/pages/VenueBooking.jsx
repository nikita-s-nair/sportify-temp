import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/api';

export default function VenueBooking() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    courtNumber: 1,
    totalAmount: 0
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchVenueDetails();
  }, [venueId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate]);

  const fetchVenueDetails = async () => {
    try {
      const response = await api.get(`/venues/${venueId}`);
      setVenue(response.data);
    } catch (error) {
      console.error('Error fetching venue details:', error);
      toast.error('Failed to load venue details');
      navigate('/venues');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTimeSlots = async () => {
    try {
      const response = await api.get(`/venues/${venueId}/available-slots`, {
        params: { date: selectedDate }
      });
      setAvailableTimeSlots(response.data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
    }
  };

  const calculateTotalAmount = () => {
    if (!bookingData.startTime || !bookingData.endTime || !venue) return 0;
    const start = new Date(`2000-01-01T${bookingData.startTime}`);
    const end = new Date(`2000-01-01T${bookingData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * venue.pricePerHour;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setBookingData({
      ...bookingData,
      date,
      startTime: '',
      endTime: ''
    });
  };

  const handleTimeChange = (type, time) => {
    setBookingData({
      ...bookingData,
      [type]: time,
      totalAmount: calculateTotalAmount()
    });
  };

  const handleBooking = async () => {
    try {
      const response = await api.post('/bookings', {
        venueId: venue.id,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        courtNumber: bookingData.courtNumber
      });

      toast.success('Booking successful!');
      navigate('/profile');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!venue) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Venue Details Header */}
          <div className="p-6 bg-blue-500 text-white">
            <h2 className="text-2xl font-bold">{venue.name}</h2>
            <p className="mt-1">{venue.location}</p>
          </div>

          {/* Booking Form */}
          <div className="p-6 space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <select
                    value={bookingData.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    {availableTimeSlots.map((slot) => (
                      <option key={slot.time} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <select
                    value={bookingData.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    {availableTimeSlots
                      .filter((slot) => slot.time > bookingData.startTime)
                      .map((slot) => (
                        <option key={slot.time} value={slot.time}>
                          {slot.time}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {/* Court Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Court</label>
              <select
                value={bookingData.courtNumber}
                onChange={(e) => setBookingData({ ...bookingData, courtNumber: parseInt(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Array.from({ length: venue.totalCourts }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Court {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {bookingData.startTime} - {bookingData.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Court:</span>
                  <span className="font-medium">Court {bookingData.courtNumber}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-900 font-semibold">Total Amount:</span>
                  <span className="text-green-600 font-semibold">₹{calculateTotalAmount()}</span>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBooking}
              disabled={!bookingData.date || !bookingData.startTime || !bookingData.endTime}
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
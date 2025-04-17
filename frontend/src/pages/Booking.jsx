import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

export default function Booking() {
  const { venueId } = useParams();
  const [date, setDate] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user'));

  const handleBooking = () => {
    if (!user) {
      alert("Please login first to make a booking.");
      return;
    }

    if (!date) {
      alert("Please select a date.");
      return;
    }

    api.post('/bookings', {
      bookingDate: date,
      venue: { id: venueId },
      user: { id: user.id }
    }).then(() => {
      alert('Booking successful!');
    }).catch(err => {
      console.error(err);
      alert('Booking failed. Please try again.');
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Book Venue</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Select Date: </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ padding: '5px', marginLeft: '10px' }}
        />
      </div>
      <button onClick={handleBooking} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
        Confirm Booking
      </button>
    </div>
  );
}

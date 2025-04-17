import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const PlayerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(`/bookings/user/id/${user.id}`);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const quickActions = [
    { title: 'Find Venues', path: '/venues', icon: '🔍', color: 'bg-blue-500' },
    { title: 'My Teams', path: '/teams', icon: '👥', color: 'bg-green-500' },
    { title: 'My Bookings', path: '/bookings', icon: '📅', color: 'bg-purple-500' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={`${action.color} p-6 rounded-lg shadow text-white hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">{action.icon}</span>
              <span className="text-lg font-medium">{action.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{booking.venue.name}</p>
                  <p className="text-sm text-gray-500">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{booking.totalAmount}</p>
                  <p className={`text-sm ${booking.status === 'CONFIRMED' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No bookings found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard; 
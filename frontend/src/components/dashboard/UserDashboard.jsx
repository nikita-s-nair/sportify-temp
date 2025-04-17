import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    favoriteVenues: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [bookingAnalytics, userAnalytics] = await Promise.all([
          api.get(`/bookings/user/id/${user.id}/analytics`),
          api.get('/users/me/analytics')
        ]);

        setAnalytics({
          totalBookings: bookingAnalytics.data.totalBookings,
          activeBookings: bookingAnalytics.data.activeBookings,
          totalSpent: bookingAnalytics.data.totalSpent,
          favoriteVenues: userAnalytics.data.favoriteVenues
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const quickActions = [
    { title: 'Book Venue', path: '/venues', icon: '🏟️', color: 'bg-blue-500' },
    { title: 'My Bookings', path: '/bookings', icon: '📅', color: 'bg-green-500' },
    { title: 'Favorites', path: '/favorites', icon: '❤️', color: 'bg-red-500' },
    { title: 'Profile', path: `/profile/${user?.username}`, icon: '👤', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.activeBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">₹{analytics.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Favorite Venues</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.favoriteVenues}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Upcoming Bookings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
        <div className="space-y-4">
          {/* Add upcoming bookings items here */}
          <p className="text-gray-500">No upcoming bookings</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 
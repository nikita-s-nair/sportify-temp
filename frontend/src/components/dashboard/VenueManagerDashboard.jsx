import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const VenueManagerDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalVenues: 0,
    activeBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [venueAnalytics, bookingAnalytics] = await Promise.all([
          api.get('/venues/manager/analytics'),
          api.get('/bookings/manager/stats')
        ]);

        setAnalytics({
          totalVenues: venueAnalytics.data.totalVenues,
          activeBookings: bookingAnalytics.data.activeBookings,
          pendingBookings: bookingAnalytics.data.pendingBookings,
          totalRevenue: bookingAnalytics.data.totalRevenue
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
    { title: 'My Venues', path: '/manager/venues', icon: '🏟️', color: 'bg-green-500' },
    { title: 'Manage Bookings', path: '/manager/bookings', icon: '📅', color: 'bg-purple-500' },
    { title: 'Add New Venue', path: '/manager/venues/new', icon: '➕', color: 'bg-blue-500' },
    { title: 'View Reports', path: '/manager/reports', icon: '📊', color: 'bg-yellow-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">🏟️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Venues</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalVenues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.activeBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.pendingBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">₹{analytics.totalRevenue.toFixed(2)}</p>
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

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {/* Add recent bookings items here */}
          <p className="text-gray-500">No recent bookings</p>
        </div>
      </div>
    </div>
  );
};

export default VenueManagerDashboard; 
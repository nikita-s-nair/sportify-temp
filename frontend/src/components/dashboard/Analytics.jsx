import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    userGrowth: [],
    revenueTrend: [],
    activeUsers: 0,
    pendingBookings: 0,
    completedBookings: 0,
    averageBookingValue: 0,
    topVenues: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [venueAnalytics, userAnalytics, bookingAnalytics] = await Promise.all([
          api.get('/admin/analytics/venues'),
          api.get('/admin/analytics/users'),
          api.get('/admin/analytics/bookings')
        ]);

        setAnalytics({
          totalUsers: userAnalytics.data.totalUsers,
          totalVenues: venueAnalytics.data.totalVenues,
          totalBookings: venueAnalytics.data.totalBookings,
          totalRevenue: venueAnalytics.data.totalRevenue,
          recentBookings: bookingAnalytics.data.recentBookings || [],
          userGrowth: userAnalytics.data.userGrowth || [],
          revenueTrend: venueAnalytics.data.revenueTrend || [],
          activeUsers: userAnalytics.data.activeUsers || 0,
          pendingBookings: bookingAnalytics.data.pendingBookings || 0,
          completedBookings: bookingAnalytics.data.completedBookings || 0,
          averageBookingValue: bookingAnalytics.data.averageBookingValue || 0,
          topVenues: venueAnalytics.data.topVenues || []
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalUsers}</p>
              <p className="text-sm text-green-600">+{analytics.activeUsers} active</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">🏟️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Venues</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalVenues}</p>
              <p className="text-sm text-gray-500">{analytics.topVenues.length} top venues</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalBookings}</p>
              <div className="flex space-x-2 text-sm">
                <span className="text-green-600">{analytics.completedBookings} completed</span>
                <span className="text-yellow-600">{analytics.pendingBookings} pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Avg: ${analytics.averageBookingValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {analytics.recentBookings.length > 0 ? (
            analytics.recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{booking.venueName}</p>
                  <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${booking.amount}</p>
                  <p className={`text-sm ${booking.status === 'CONFIRMED' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent bookings</p>
          )}
        </div>
      </div>

      {/* Top Venues */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Venues</h2>
        <div className="space-y-4">
          {analytics.topVenues.length > 0 ? (
            analytics.topVenues.map((venue) => (
              <div key={venue.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{venue.name}</p>
                  <p className="text-sm text-gray-500">{venue.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{venue.totalBookings} bookings</p>
                  <p className="text-sm text-green-500">${venue.revenue.toFixed(2)} revenue</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No venue data available</p>
          )}
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Growth</h2>
        <div className="h-64">
          {/* Add chart component here */}
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trend</h2>
        <div className="h-64">
          {/* Add chart component here */}
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
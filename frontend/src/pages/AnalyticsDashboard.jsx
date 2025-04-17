import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return; // Wait for auth check to complete
      
      if (!isLoggedIn || userRole !== 'ADMIN') {
        navigate('/login');
        return;
      }
      await fetchAnalytics();
    };

    checkAdminStatus();
  }, [navigate, isLoggedIn, userRole, authLoading]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics/venues');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of your sports venue management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-500">Total Venues</h3>
              <span className="text-2xl">🏟️</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{analytics.totalVenues}</p>
            <p className="mt-2 text-sm text-gray-500">Active venues available</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-500">Total Bookings</h3>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{analytics.totalBookings}</p>
            <p className="mt-2 text-sm text-gray-500">Completed bookings</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">${analytics.totalRevenue.toLocaleString()}</p>
            <p className="mt-2 text-sm text-gray-500">Total earnings</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
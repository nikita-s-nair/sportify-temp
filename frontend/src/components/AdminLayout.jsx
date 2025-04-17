import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  // Check if user is authenticated and is an admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <a
            href="/admin/venues"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Venue Management
          </a>
          <a
            href="/admin/bookings"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Booking Management
          </a>
          <a
            href="/admin/users"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            User Management
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
} 
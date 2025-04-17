import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showAdminForm, setShowAdminForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', {
        ...newAdmin,
        role: 'ADMIN'
      });
      toast.success('New admin user created successfully!');
      setNewAdmin({ username: '', email: '', password: '' });
      setShowAdminForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin user');
    }
  };

  const quickActions = [
    { title: 'Venue Management', path: '/admin/venues', icon: '🏟️', color: 'bg-green-500' },
    { title: 'Booking Management', path: '/admin/bookings', icon: '📅', color: 'bg-purple-500' },
    { title: 'User Management', path: '/admin/users', icon: '👥', color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8">
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
        <button
          onClick={() => setShowAdminForm(true)}
          className="bg-blue-500 p-6 rounded-lg shadow text-white hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">👤</span>
            <span className="text-lg font-medium">Add Admin User</span>
          </div>
        </button>
      </div>

      {/* Admin User Creation Form */}
      {showAdminForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdminForm(false)}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create New Admin User</h2>
                <form onSubmit={handleCreateAdmin} className="space-y-5">
                  <div>
                    <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      value={newAdmin.username}
                      onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                      placeholder="Enter username"
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      placeholder="Enter password"
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-medium transition duration-300"
                  >
                    Create Admin User
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 
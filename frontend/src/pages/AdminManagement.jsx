import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

export default function AdminManagement() {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, userRole, isLoading } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isLoading) {
        return;
      }

      if (!isLoggedIn) {
        navigate('/login');
        return;
      }

      if (userRole !== 'ADMIN') {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAdminStatus();
  }, [navigate, isLoggedIn, userRole, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password && form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/users/register/admin', form);
      toast.success('New admin user created successfully!');
      setForm({ username: '', email: '', password: '' });
      console.log("Admin creation successful:", res.data);
    } catch (err) {
      console.error("Admin creation failed:", err);
      const errorMessage = err.response?.data;
      
      if (errorMessage) {
        if (errorMessage.toLowerCase().includes('username')) {
          setErrors(prev => ({ ...prev, username: 'This username is already taken' }));
        } else if (errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Failed to create admin user");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  const managementSections = [
    { title: 'Analytics Dashboard', path: '/admin/analytics', icon: '📊' },
    { title: 'User Management', path: '/admin/users', icon: '👥' },
    { title: 'Venue Management', path: '/admin/venues', icon: '🏟️' },
    { title: 'Booking Management', path: '/admin/bookings', icon: '📅' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Admin Management</h1>
          <p className="mt-2 text-gray-600">Manage your sports venue system</p>
        </div>
        
        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {managementSections.map((section) => (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center"
            >
              <span className="text-4xl mb-4">{section.icon}</span>
              <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
            </button>
          ))}
        </div>

        {/* Create New Admin Section */}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create New Admin User</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-medium transition duration-300 disabled:opacity-50"
            >
              {loading ? "Creating Admin..." : "Create Admin User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 
import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '',
    role: 'PLAYER' // Default role
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const roles = [
    { value: 'PLAYER', label: 'Player' },
    { value: 'VENUE_MANAGER', label: 'Venue Manager' },
    { value: 'COACH', label: 'Coach' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
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
    if (!form.role) newErrors.role = 'Please select a role';

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
      const res = await api.post('/users/register', form);

      toast.success('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);

      console.log("Registration successful:", res.data);
    } catch (err) {
      console.error("Registration failed - Full error:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      const errorMessage = err.response?.data;
      
      if (errorMessage) {
        console.log("Raw error message:", errorMessage);
        // Handle username already taken
        if (errorMessage.toLowerCase().includes('username')) {
          setErrors(prev => ({ ...prev, username: 'This username is already taken. Please choose another one.' }));
        }
        // Handle email already registered
        if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('query did not return a unique result')) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered. Please use a different email or try logging in.' }));
        }
        // Handle role validation errors
        if (errorMessage.toLowerCase().includes('role')) {
          setErrors(prev => ({ ...prev, role: 'Please select a valid role' }));
        }
        // If neither username nor email error, show general error
        if (!errorMessage.toLowerCase().includes('username') && 
            !errorMessage.toLowerCase().includes('email') && 
            !errorMessage.toLowerCase().includes('query did not return a unique result') &&
            !errorMessage.toLowerCase().includes('role')) {
          toast.error('Registration failed. Please check your information and try again.');
        }
      } else {
        toast.error("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
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
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`w-full border ${errors.role ? 'border-red-500' : 'border-gray-300'} p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-medium transition duration-300 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}

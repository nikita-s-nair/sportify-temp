import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userRole, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBasedNavItems = () => {
    const commonItems = [
      { title: 'Dashboard', path: '/dashboard', icon: '🏠' },
      { title: 'Profile', path: `/profile/${username}`, icon: '👤' },
    ];

    const adminItems = [
      { title: 'User Management', path: '/admin/users', icon: '👥' },
      { title: 'Venue Management', path: '/admin/venues', icon: '🏟️' },
      { title: 'Booking Management', path: '/admin/bookings', icon: '📅' },
    ];

    const venueManagerItems = [
      { title: 'My Venues', path: '/manager/venues', icon: '🏟️' },
      { title: 'Bookings', path: '/manager/bookings', icon: '📅' },
      { title: 'Analytics', path: '/manager/analytics', icon: '📊' },
    ];

    const playerItems = [
      { title: 'Find Venues', path: '/player/venues', icon: '🔍' },
      { title: 'My Bookings', path: '/player/bookings', icon: '📅' },
      { title: 'My Teams', path: '/player/teams', icon: '👥' },
    ];

    switch (userRole) {
      case 'ADMIN':
        return [...commonItems, ...adminItems];
      case 'VENUE_MANAGER':
        return [...commonItems, ...venueManagerItems];
      case 'PLAYER':
        return [...commonItems, ...playerItems];
      default:
        return commonItems;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition duration-200 ease-in-out bg-white w-64 shadow-lg`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">Sportify</h1>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {getRoleBasedNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <span className="mr-3">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} md:ml-64 transition-all duration-200`}>
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white shadow">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-500 rounded-md md:hidden hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center">
            <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              {userRole}
            </span>
          </div>
        </div>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 
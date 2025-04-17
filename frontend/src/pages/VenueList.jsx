import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        // Try the search endpoint first
        const response = await api.get('/venues/search');
        setVenues(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching venues:', err);
        
        // If search endpoint fails, try the main venues endpoint
        try {
          const response = await api.get('/venues');
          setVenues(response.data);
          setLoading(false);
        } catch (secondErr) {
          console.error('Error fetching venues from fallback endpoint:', secondErr);
          
          if (secondErr.response && secondErr.response.status === 403) {
            // If unauthorized, show a message and redirect to login
            toast.error('Please log in to view venues');
            navigate('/login');
          } else if (secondErr.response && secondErr.response.status === 500) {
            setError('Server error. Please try again later or contact support.');
          } else {
            setError('Failed to fetch venues. Please try again later.');
          }
          
          setLoading(false);
        }
      }
    };

    fetchVenues();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Available Venues</h1>
      {venues.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">No venues available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
                <p className="text-gray-600 mb-4">{venue.description || 'No description available'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">
                    Capacity: {venue.totalCourts || 'N/A'}
                  </span>
                  <span className="text-green-600 font-medium">
                    ${venue.pricePerHour || 'N/A'}/hour
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueList; 
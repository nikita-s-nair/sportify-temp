import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-toastify';

const VenueList = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await api.get('/venues');
      setVenues(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to load venues. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/venues/search?q=${searchTerm}&sportType=${selectedSport}`);
      setVenues(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching venues:', err);
      setError('Failed to search venues. Please try again later.');
      setLoading(false);
    }
  };

  const handleBookNow = (venueId) => {
    if (!isLoggedIn) {
      toast.error('Please log in to book a venue');
      navigate('/login');
      return;
    }
    navigate(`/book/${venueId}`);
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Available Venues</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sports</option>
            <option value="TENNIS">Tennis</option>
            <option value="BADMINTON">Badminton</option>
            <option value="BASKETBALL">Basketball</option>
            <option value="FOOTBALL">Football</option>
          </select>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {venue.imageUrl && (
              <img
                src={venue.imageUrl}
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
              <p className="text-gray-600 mb-2">{venue.location}</p>
              <p className="text-gray-600 mb-2">Sport: {venue.sportType}</p>
              <p className="text-gray-600 mb-2">Available Courts: {venue.totalCourts}</p>
              <p className="text-gray-600 mb-4">${venue.pricePerHour}/hour</p>
              
              <button
                onClick={() => handleBookNow(venue.id)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {venues.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-8">
          No venues found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default VenueList; 
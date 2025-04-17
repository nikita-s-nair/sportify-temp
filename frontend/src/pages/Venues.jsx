import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/venues')
      .then(response => setVenues(response.data))
      .catch(err => {
        console.error(err);
        toast.error('⚠️ Failed to load venues. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const getSportEmoji = (type) => {
    switch (type?.toLowerCase()) {
      case 'badminton':
        return '🏸';
      case 'football':
        return '⚽';
      case 'cricket':
        return '🏏';
      case 'tennis':
        return '🎾';
      case 'basketball':
        return '🏀';
      case 'swimming':
        return '🏊‍♂️';
      case 'table tennis':
        return '🏓';
      default:
        return '🎯';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Venues</h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-6 h-6 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center text-gray-600">No venues available at the moment.</div>
      ) : (
        <ul className="space-y-4">
          {venues.map(venue => (
            <li
              key={venue.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200 bg-white"
            >
              <div className="flex gap-4 items-center sm:items-start">
                {/* Venue Image */}
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  className="w-28 h-28 rounded-lg object-cover shadow-sm"
                />

                {/* Venue Info + Button */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600 flex items-center gap-1 mb-1">
                      {getSportEmoji(venue.sportType)} {venue.sportType}
                    </p>
                    <h3 className="text-lg font-bold text-gray-800">{venue.name}</h3>
                    <p className="text-gray-500">{venue.location}</p>
                  </div>

                  <div className="mt-4">
                    <Link
                      to={`/book/${venue.id}`}
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

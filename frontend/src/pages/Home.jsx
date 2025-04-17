import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Make sure this CSS file exists

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome to Sportify</h1>
        <p className="home-subtitle">Book your favorite sports venue effortlessly.</p>
        <div className="home-buttons">
          <Link to="/venues" className="btn btn-primary">Browse Venues</Link>
          <Link to="/bookings" className="btn btn-secondary">View Bookings</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

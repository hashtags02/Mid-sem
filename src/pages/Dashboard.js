import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Import all the same components as the landing page
import HeroSection from '../components/HeroSection';
import FeaturedRestaurants from '../components/FeaturedRestaurants';
import HowItWorks from '../components/HowItWorks';
import FeaturedDishes from '../components/FeaturedDishes';
import PromoHeader from '../components/PromoHeader';
import PromoSection from '../components/PromoSection';
import OfferCards from '../components/OfferCards';
import AboutUsSection from '../components/AboutUsSection';
import FoodGalleryRow from '../components/FoodGalleryRow';
import KeyHighlightsSection from '../components/KeyHighlightsSection';
import FooterSection from '../components/FooterSection';

import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (_) {}
  };

  return (
    <div className="dashboard">
      <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'flex-end', background: '#0b1220', padding: '8px 12px' }}>
          <button onClick={handleLogout} aria-label="Logout" style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ width: 24, height: 2, background: '#fff', display: 'block', borderRadius: 2 }} />
            <span style={{ width: 24, height: 2, background: '#fff', display: 'block', borderRadius: 2 }} />
            <span style={{ width: 24, height: 2, background: '#fff', display: 'block', borderRadius: 2 }} />
          </button>
        </div>
      </div>
      {/* Main Content - Exact same as landing page */}
      <main className="dashboard-main">
        <HeroSection />
        <FeaturedRestaurants />
        <HowItWorks />
        <FeaturedDishes />
        <PromoHeader />
        <PromoSection />
        <OfferCards />
        <AboutUsSection />
        <FoodGalleryRow />
        <KeyHighlightsSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Dashboard;

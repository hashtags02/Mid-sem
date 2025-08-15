import React from 'react';
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
  return (
    <div className="dashboard">
      <Navbar />
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

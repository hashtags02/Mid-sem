import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// ✅ Auth Pages (stay under /pages)
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Dashboard from "./pages/Dashboard";
import TrackingPage from "./pages/TrackingPage";

// ✅ Components (moved under /components)
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedRestaurants from "./components/FeaturedRestaurants";
import HowItWorks from "./components/HowItWorks";
import FeaturedDishes from "./components/FeaturedDishes";
import PromoSection from "./components/PromoSection";
import PromoHeader from "./components/PromoHeader";
import OfferCards from "./components/OfferCards";
import AboutUsSection from "./components/AboutUsSection";
import FoodGalleryRow from "./components/FoodGalleryRow";
import KeyHighlightsSection from "./components/KeyHighlightsSection";
import FooterSection from "./components/FooterSection";

import FoodCategorySection from "./components/FoodCategorySection";
import AllDishesPage from "./components/AllDishesPage";
import CartPage from "./pages/CartPage";

import OldSchoolEateryPage from "./components/OldSchoolEateryPage";
import DominosPizzaPage from "./components/DominosPizzaPage";
import LePrivePage from "./components/LePrivePage";
import SouthCafePage from "./components/SouthCafePage";
import SantoshPavBhajiPage from "./components/SantoshPavBhajiPage";
import UrbanBitesPage from "./components/UrbanBitesPage";
import PunjabiDhabaPage from "./components/PunjabiDhabaPage";
import RajasthaniRasoiPage from "./components/RajasthaniRasoiPage";
import TheChaatChaskaPage from "./components/TheChaatChaskaPage";
import MomosHutPage from "./components/MomosHutPage";

import "./App.css";

function LandingPage() {
  return (
    <>
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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 🏠 Main Landing */}
            <Route path="/" element={
              <>
                <Navbar />
                <LandingPage />
              </>
            } />

            {/* 🍽️ Food Sections */}
            <Route path="/categories" element={<FoodCategorySection />} />
            <Route path="/all-dishes" element={<AllDishesPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* 🍴 Restaurant Pages */}
            <Route path="/old-school-eatery" element={<OldSchoolEateryPage />} />
            <Route path="/dominos-pizza" element={<DominosPizzaPage />} />
            <Route path="/le-prive" element={<LePrivePage />} />
            <Route path="/south-cafe" element={<SouthCafePage />} />
            <Route path="/santosh-pav-bhaji" element={<SantoshPavBhajiPage />} />
            <Route path="/urban-bites" element={<UrbanBitesPage />} />
            <Route path="/punjabi-dhaba" element={<PunjabiDhabaPage />} />
            <Route path="/rajasthani-rasoi" element={<RajasthaniRasoiPage />} />
            <Route path="/the-chaat-chaska" element={<TheChaatChaskaPage />} />
            <Route path="/momos-hut" element={<MomosHutPage />} />

            {/* 📍 Order Tracking Routes */}
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/track/:orderId" element={<TrackingPage />} />

            {/* 🔐 Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

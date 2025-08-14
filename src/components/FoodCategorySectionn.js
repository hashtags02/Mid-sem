// src/components/FoodCategorySectionn.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW for navigation
import "./FoodCategorySectionn.css";
import GlobalSearch from "./GlobalSearch";

// Import dishes data for search suggestions
const dishesData = [
  { name: "Red Sauce Pasta", price: 300, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/0892e095adc768a6f3daa568d10b74c5_kytasc.jpg", isVeg: true },
  { name: "Grilled Burger", price: 250, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/859adef90e854238d9b330d0c7d2cf73_get6ol.jpg", isVeg: false },
  { name: "Paneer Pizza", price: 350, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752563696/410b32a87e020b0e8dbe8a2850d8ca29_socitw.jpg", isVeg: true },
  { name: "Cheese Samosa", price: 100, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752563713/043f9704cb216d23dab6ebb934b9f7b7_v01vwv.jpg", isVeg: true },
  { name: "Spicy Momos", price: 150, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398135/0b5eb439a0fe2c71aa7b427d3402e1ea_jd6bkm.jpg", isVeg: true },
  { name: "Chicken Rice", price: 400, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398029/3e10bbc839b5ab13a9561cfed1f6fa8b_brpb4b.jpg", isVeg: false },
  { name: "Veggie Salad", price: 200, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398575/15de2cac5615a54813f8e0a8530c6876_whxeeu.jpg", isVeg: true },
  { name: "Paneer Tikka", price: 320, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg", isVeg: true },
  { name: "Dosa", price: 420, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/781c6867d971c5fa7a704c992dc755c3_waxhi9.jpg", isVeg: false },
  { name: "Rasmalai", price: 80, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg", isVeg: true },
];

const categories = [
  { name: "North Indian", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077119/7525c28b815e93b8f4ad4a3bb889090e_vtd6mi.jpg" },
  { name: "Italian", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335211/food1_z8vt3v.jpg" },
  { name: "South Indian", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335221/food10_n3pfgy.jpg" },
  { name: "Chinese", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335213/food3_islz2v.jpg" },
  { name: "Snacks", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335220/food5_vb4td0.jpg?w=400&h=300&fit=crop&crop=center" },
];
    
const FoodCategorySectionn = ({ onSearch }) => {
  const [index, setIndex] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const navigate = useNavigate(); // ✅ Initialize navigate

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.trim().length > 0);
    
    if (onSearch) {
      onSearch(query);
    }
  };

  // Handle dish selection from search results
  const handleDishSelect = (dish) => {
    setSearchQuery(dish.name);
    setShowSearchResults(false);
    if (onSearch) {
      onSearch(dish.name);
    }
  };

  // Close search results when clicking outside
  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const visibleItems = [
    (index - 2 + categories.length) % categories.length,
    (index - 1 + categories.length) % categories.length,
    index,
    (index + 1) % categories.length,
    (index + 2) % categories.length,
  ];

  return (
    <section className="food-category">
      <div className="container">
        {/* ✅ Header */}
        <header className="food-category__header">
          <div className="logo-wrap">
            <h1 className="logo">
              Crave<span>Cart</span>
            </h1>
          </div>

          <div className="header-center">
            <div className="search-container">
              <GlobalSearch placeholder="Search for your cravings..." />
            </div>
          </div>

          <div className="header-icons">
            <span className="menu-icon">&#9776;</span>
            {/* ✅ Cart icon with navigate */}
            <span className="cart-icon">
              <img
                src="https://res.cloudinary.com/dlurlrbou/image/upload/v1752564365/download-removebg-preview_9_xch5mc.png"
                alt="Cart"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={() => navigate("/cart")} // ✅ This routes to /cart
              />
            </span>
          </div>
        </header>

        {/* ✅ Arrows */}
        <div className="arrow-controls">
          <span className="arrow left" onClick={prevSlide}>
            &lt;
          </span>
          <span className="arrow right" onClick={nextSlide}>
            &gt;
          </span>
        </div>

        {/* ✅ Carousel */}
        <div className="food-category__slider">
          <div className="slider-inner">
            {visibleItems.map((i) => (
              <div
                key={i}
                className={`category ${i === index ? "main" : "side"}`}
              >
                <img src={categories[i].image} alt={categories[i].name} />
                <p>{categories[i].name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Tagline */}
        <h2 className="tagline">
          Your Favourite <br />
          Cravings, <br />
          Delivered In Minutes
        </h2>
      </div>
    </section>
  );
};

export default FoodCategorySectionn;

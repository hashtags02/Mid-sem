// src/components/FoodCategorySectionn.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW for navigation
import "./FoodCategorySectionn.css";

const categories = [
  { name: "North Indian", image: "/northIndian.png" },
  { name: "Italian", image: "/italian.png" },
  { name: "South Indian", image: "/southIndian.png" },
  { name: "North Indian", image: "/northIndian.png" },
  { name: "Snack", image: "/snack.png" },
];

const FoodCategorySectionn = () => {
  const [index, setIndex] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate(); // ✅ Initialize navigate

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
              <input
                type="text"
                placeholder="Search for your cravings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

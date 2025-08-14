import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FoodCategorySection.css";
import DiscountBonanza from "./DiscountBonanza";
import AllRestaurants from "./AllRestaurants";

const categories = [
  { name: "North Indian", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077119/7525c28b815e93b8f4ad4a3bb889090e_vtd6mi.jpg" },
  { name: "Italian", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335211/food1_z8vt3v.jpg" },
  { name: "Chinese", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335213/food3_islz2v.jpg" },
  { name: "Snacks", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335220/food5_vb4td0.jpg" },
  { name: "South Indian", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/781c6867d971c5fa7a704c992dc755c3_waxhi9.jpg" },
  { name: "Mexican", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335197/burger_yrnmbm.jpg" },
];

const FoodCategorySection = () => {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  // Arrange categories so that `index` is in the center
  const categoriesOrder = [
    categories[(index - 2 + categories.length) % categories.length],
    categories[(index - 1 + categories.length) % categories.length],
    categories[index],
    categories[(index + 1) % categories.length],
    categories[(index + 2) % categories.length],
  ];

  const centerIndex = 2; // middle of the 5

  return (
    <>
      <section className="food-category">
        <div className="container">
          {/* Header */}
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
              <span
                className="cart-icon"
                onClick={() => navigate("/cart")}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://res.cloudinary.com/dlurlrbou/image/upload/v1752564365/download-removebg-preview_9_xch5mc.png"
                  alt="Cart"
                  style={{ width: "30px", height: "30px" }}
                />
              </span>
            </div>
          </header>

          {/* Arrows */}
          <div className="arrow-controls">
            <span className="arrow left" onClick={prevSlide}>
              &lt;
            </span>
            <span className="arrow right" onClick={nextSlide}>
              &gt;
            </span>
          </div>

          {/* Carousel */}
          <div className="food-category__slider">
            <div className="slider-inner">
              {categoriesOrder.map((cat, i) => (
                <div
                  key={i}
                  className={`category ${i === centerIndex ? "main" : "side"}`}
                >
                  <img src={cat.image} alt={cat.name} />
                  <p>{cat.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tagline */}
          <h2 className="tagline">
            Your Favourite <br />
            Cravings, <br />
            Delivered In Minutes
          </h2>
        </div>
      </section>

      {/* Pass searchQuery as prop */}
      <DiscountBonanza />
      <AllRestaurants searchQuery={searchQuery} />
    </>
  );
};

export default FoodCategorySection;

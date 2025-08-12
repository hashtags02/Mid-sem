// src/components/FeaturedDishes.js

import React from "react";
import { Link } from "react-router-dom";
import './FeaturedDishes.css';

const dishes = [
  { 
    name: "Red Sauce Pasta",
    restaurant: "Koa Cafe",
    rating: 4.5,
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335235/pasta_kikytt.jpg",
  },
  {
    name: "Grilled Burger",
    restaurant: "Burger King",
    rating: 4.7,
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335197/burger_yrnmbm.jpg",
  },
  {
    name: "Paneer Pizza",
    restaurant: "PizzaWala's",
    rating: 4.6,
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335211/food1_z8vt3v.jpg",
  },
  {
    name: "Cheese Samosa",
    restaurant: "Jagdish Samosa",
    rating: 4.4,
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335242/samosa_q7pecl.jpg",
  },
];

function FeaturedDishes() {
  return (
    <section className="featured-dishes">
      <div className="section-header">
        <h2 className="section-title">Featured Dishes</h2>
        <Link to="/all-dishes">
          <span className="section-arrow">&gt;</span>
        </Link>
      </div>

      <div className="restaurant-grid">
        {dishes.map((dish, idx) => (
          <div className="restaurant-card" key={idx}>
            <img src={dish.image} alt={dish.name} className="restaurant-img" />
            <div className="restaurant-info">
              <div className="restaurant-name">{dish.name}</div>
              <div className="restaurant-cuisine">{dish.restaurant}</div>
              <div className="restaurant-rating">
                <span className="star">★</span> {dish.rating}
              </div>
              <button className="order-now-btn">Order Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedDishes;

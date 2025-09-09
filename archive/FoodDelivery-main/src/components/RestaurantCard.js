import React from "react";

function RestaurantCard({ image, name, cuisine, rating, reviews }) {
  return (
    <div className="restaurant-card">
      <img src={image} alt={name} className="restaurant-img" />
      <div className="restaurant-info">
        <div className="restaurant-name">{name}</div>
        <div className="restaurant-cuisine">{cuisine}</div>
        <div className="restaurant-rating">
          <span className="star">★</span> {rating} <span className="reviews">({reviews})</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard; 
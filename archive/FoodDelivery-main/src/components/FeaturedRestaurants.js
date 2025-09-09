import React from "react";
import "./FeaturedRestaurants.css";
import { useNavigate } from "react-router-dom";

const restaurants = [
  {
    name: "Red Sauce Pasta",
    restaurant: "Koa Cafe",
    rating: 4.5,
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335205/dish2_jlcq4a.jpg",
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
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335236/pizza_eo0k4v.jpg",
  },
  {
    name: "Cheese Samosa",
    restaurant: "Jagdish Samosa",
    rating: 4.4,
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335242/samosa_q7pecl.jpg",
  },
];

function FeaturedRestaurants() {
  const navigate = useNavigate();

  return (
    <section className="featured-restaurants">
      <div className="section-header">
        <h2 className="section-title">Featured Restaurants</h2>

        <span
          className="section-arrow"
          onClick={() => navigate("/categories")}
          style={{ cursor: "pointer" }}
        >
          &gt;
        </span>
      </div>

      <div className="restaurant-grid">
        {restaurants.map((rest, idx) => (
          <div className="restaurant-card" key={idx}>
            <img src={rest.image} alt={rest.name} className="restaurant-img" />
            <div className="restaurant-info">
              <div className="restaurant-name">{rest.name}</div>
              <div className="restaurant-cuisine">{rest.restaurant}</div>
              <div className="restaurant-rating">
                <span className="star">★</span> {rest.rating}
              </div>
              <button className="order-now-btn">Order Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedRestaurants;

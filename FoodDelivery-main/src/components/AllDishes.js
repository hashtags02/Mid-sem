import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./AllDishes.css";

// Mapping of dishes to restaurants
const dishToRestaurants = {
  "Red Sauce Pasta": [
    { name: "Le Prive", route: "/le-prive", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335211/food1_z8vt3v.jpg" },
    { name: "Urban Bites", route: "/urban-bites", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398575/15de2cac5615a54813f8e0a8530c6876_whxeeu.jpg" }
  ],
  "Grilled Burger": [
    { name: "Old School Eatery", route: "/old-school-eatery", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335220/food5_vb4td0.jpg" },
    { name: "Urban Bites", route: "/urban-bites", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398575/15de2cac5615a54813f8e0a8530c6876_whxeeu.jpg" }
  ],
  "Paneer Pizza": [
    { name: "Dominos Pizza", route: "/dominos-pizza", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752563696/410b32a87e020b0e8dbe8a2850d8ca29_socitw.jpg" },
    { name: "Old School Eatery", route: "/old-school-eatery", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335220/food5_vb4td0.jpg" }
  ],
  "Cheese Samosa": [
    { name: "Santosh Pav Bhaji", route: "/santosh-pav-bhaji", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335213/food3_islz2v.jpg" },
    { name: "Punjabi Dhaba", route: "/punjabi-dhaba", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg" }
  ],
  "Spicy Momos": [
    { name: "Momos Hut", route: "/momos-hut", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398135/0b5eb439a0fe2c71aa7b427d3402e1ea_jd6bkm.jpg" },
    { name: "Urban Bites", route: "/urban-bites", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398575/15de2cac5615a54813f8e0a8530c6876_whxeeu.jpg" }
  ],
  "Chicken Rice": [
    { name: "South Cafe", route: "/south-cafe", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398029/3e10bbc839b5ab13a9561cfed1f6fa8b_brpb4b.jpg" },
    { name: "Urban Bites", route: "/urban-bites", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398575/15de2cac5615a54813f8e0a8530c6876_whxeeu.jpg" }
  ],
  "Veggie Salad": [
    { name: "Urban Bites", route: "/urban-bites", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398575/15de2cac5615a54813f8e0a8530c6876_whxeeu.jpg" },
    { name: "South Cafe", route: "/south-cafe", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398029/3e10bbc839b5ab13a9561cfed1f6fa8b_brpb4b.jpg" }
  ],
  "Paneer Tikka": [
    { name: "Punjabi Dhaba", route: "/punjabi-dhaba", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg" },
    { name: "Rajasthani Rasoi", route: "/rajasthani-rasoi", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg" }
  ],
  "Dosa": [
    { name: "South Cafe", route: "/south-cafe", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/781c6867d971c5fa7a704c992dc755c3_waxhi9.jpg" },
    { name: "Rajasthani Rasoi", route: "/rajasthani-rasoi", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg" }
  ],
  "Rasmalai": [
    { name: "Rajasthani Rasoi", route: "/rajasthani-rasoi", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg" },
    { name: "Punjabi Dhaba", route: "/punjabi-dhaba", image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg" }
  ]
};

// Dish list
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
  { name: "Rasmalai", price: 80, image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg", isVeg: true }
];

const AllDishes = ({ searchQuery = "" }) => {
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let filtered = dishesData;
    if (searchQuery.trim()) {
      filtered = filtered.filter((dish) =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (showVegOnly) {
      filtered = filtered.filter((d) => d.isVeg);
    }
    setDishes(filtered.slice(0, 10));
  }, [showVegOnly, searchQuery]);

  const loadMoreDishes = useCallback(() => {
    let filtered = dishesData;
    if (searchQuery.trim()) {
      filtered = filtered.filter((dish) =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (showVegOnly) {
      filtered = filtered.filter((d) => d.isVeg);
    }
    const currentLength = dishes.length;
    const more = filtered.slice(currentLength, currentLength + 10);
    if (more.length > 0) {
      setDishes((prev) => [...prev, ...more]);
    }
  }, [dishes, showVegOnly, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMoreDishes();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreDishes]);

  const toggleVeg = () => {
    setShowVegOnly((prev) => !prev);
  };

  const handleDishClick = (dish) => {
    const restaurants = dishToRestaurants[dish.name];
    if (restaurants && restaurants.length > 0) {
      setSelectedDish(dish);
      setShowRestaurantModal(true);
    } else {
      navigate("/all-dishes");
    }
  };

  const handleRestaurantSelect = (restaurant) => {
    setShowRestaurantModal(false);
    navigate(restaurant.route);
  };

  const closeModal = () => {
    setShowRestaurantModal(false);
    setSelectedDish(null);
  };

  return (
    <section className="all-dishes">
      <div className="all-dishes-header">
        <h2>All Dishes</h2>
        <div className="filters" onClick={toggleVeg}>
          <span className="filter-label">{showVegOnly ? "Veg: ON" : "Veg: OFF"}</span>
          <div className={`filter-toggle ${showVegOnly ? "on" : ""}`}></div>
        </div>
      </div>

      <div className="dish-grid">
        {dishes.length > 0 ? (
          dishes.map((dish, index) => (
            <div className="dish-card" key={index}>
              <img
                src={dish.image}
                alt={dish.name}
                onClick={() => handleDishClick(dish)}
                style={{ cursor: "pointer" }}
              />
              <p
                className="dish-name"
                onClick={() => handleDishClick(dish)}
                style={{ cursor: "pointer" }}
              >
                {dish.name}
              </p>
              <p className="dish-price">₹ {dish.price}</p>

              {/* Visit Restaurant button instead of Add to Cart */}
              <button
                className="visit-restaurant-btn"
                onClick={() => handleDishClick(dish)}
              >
                Visit Restaurant
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No dishes found matching "{searchQuery}"</p>
            <p>Try searching for something else or check your spelling</p>
          </div>
        )}
      </div>

      {showRestaurantModal && selectedDish && (
        <div className="restaurant-modal-overlay" onClick={closeModal}>
          <div className="restaurant-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose Restaurant for {selectedDish.name}</h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="restaurant-options">
              {dishToRestaurants[selectedDish.name].map((restaurant, index) => (
                <div
                  key={index}
                  className="restaurant-option"
                  onClick={() => handleRestaurantSelect(restaurant)}
                >
                  <img src={restaurant.image} alt={restaurant.name} />
                  <div className="restaurant-info">
                    <h4>{restaurant.name}</h4>
                    <p>Click to order from this restaurant</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AllDishes;

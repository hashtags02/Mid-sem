import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./AllDishes.css";

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

const AllDishes = () => {
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [dishes, setDishes] = useState([]);

  const { addToCart } = useContext(CartContext); // ✅ get addToCart
  const navigate = useNavigate(); // ✅ for navigation

  useEffect(() => {
    const filtered = showVegOnly
      ? dishesData.filter((d) => d.isVeg)
      : dishesData;
    setDishes(filtered.slice(0, 10));
  }, [showVegOnly]);

  const loadMoreDishes = useCallback(() => {
    const filtered = showVegOnly
      ? dishesData.filter((d) => d.isVeg)
      : dishesData;

    const currentLength = dishes.length;
    const more = filtered.slice(currentLength, currentLength + 10);
    if (more.length > 0) {
      setDishes((prev) => [...prev, ...more]);
    }
  }, [dishes, showVegOnly]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        loadMoreDishes();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreDishes]);

  const toggleVeg = () => {
    setShowVegOnly((prev) => !prev);
  };

  return (
    <section className="all-dishes">
      <div className="all-dishes-header">
        <h2>All Dishes</h2>
        <div className="filters" onClick={toggleVeg}>
          <span className="filter-label">
            {showVegOnly ? "Veg: ON" : "Veg: OFF"}
          </span>
          <div className={`filter-toggle ${showVegOnly ? "on" : ""}`}></div>
        </div>
      </div>

      <div className="dish-grid">
        {dishes.map((dish, index) => (
          <div className="dish-card" key={index}>
            <img src={dish.image} alt={dish.name} />
            <p className="dish-name">{dish.name}</p>
            <p className="dish-price">₹ {dish.price}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => {
                addToCart(dish);    // ✅ add to cart
                navigate("/cart");  // ✅ go to cart page
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllDishes;

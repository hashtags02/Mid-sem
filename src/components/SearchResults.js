import React from "react";
import { useNavigate } from "react-router-dom";
import "./SearchResults.css";

// Mapping of dishes to restaurants where they're available
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

const SearchResults = ({ searchQuery, dishes, onSelectDish, isVisible }) => {
  const navigate = useNavigate();

  if (!isVisible || !searchQuery.trim()) {
    return null;
  }

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDishSelect = (dish) => {
    onSelectDish(dish);
    
    // Check if we have restaurant information for this dish
    const restaurants = dishToRestaurants[dish.name];
    
    if (restaurants && restaurants.length > 0) {
      if (restaurants.length === 1) {
        // If only one restaurant, navigate directly
        navigate(restaurants[0].route);
      } else {
        // If multiple restaurants, show selection modal
        // For now, navigate to first one, but you could implement a modal here too
        navigate(restaurants[0].route);
      }
    } else {
      // Fallback to all dishes page if no restaurant mapping
      navigate("/all-dishes");
    }
  };

  return (
    <div className="search-results-dropdown">
      {filteredDishes.length > 0 ? (
        filteredDishes.map((dish, index) => {
          const restaurants = dishToRestaurants[dish.name] || [];
          return (
            <div
              key={index}
              className="search-result-item"
              onClick={() => handleDishSelect(dish)}
            >
              <img src={dish.image} alt={dish.name} />
              <div className="dish-info">
                <span className="dish-name">{dish.name}</span>
                <span className="dish-price">₹{dish.price}</span>
                {restaurants.length > 0 && (
                  <span className="restaurant-info">
                    Available at: {restaurants.length === 1 
                      ? restaurants[0].name 
                      : `${restaurants.length} restaurants (${restaurants.map(r => r.name).join(', ')})`
                    }
                  </span>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-results">
          <p>No dishes found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

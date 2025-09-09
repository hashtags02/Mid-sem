import React, { useState } from "react";
import "./RestaurantSearch.css";

const RestaurantSearch = ({ menu, placeholder = "Search in this restaurant..." }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.trim().length > 0);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="restaurant-search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        onBlur={handleSearchBlur}
        onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
        className="restaurant-search-input"
      />
      
      {showSearchResults && (
        <div className="restaurant-search-results">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item, index) => (
              <div key={index} className="restaurant-search-result-item">
                <img src={item.photo} alt={item.name} />
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-category">{item.category}</span>
                  <span className="item-price">₹{item.price}</span>
                  <span className="item-description">{item.description}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No items found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantSearch;

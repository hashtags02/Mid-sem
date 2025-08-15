// src/components/AllDishesPage.js

import React, { useState } from "react";
import FoodCategorySectionn from "./FoodCategorySectionn"; // ✅ Correct casing
import AllDishes from "./AllDishes";

export default function AllDishesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <FoodCategorySectionn onSearch={handleSearch} />
      <AllDishes searchQuery={searchQuery} />
    </>
  );
}

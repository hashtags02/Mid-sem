// src/components/AllDishesPage.js

import React from "react";
import FoodCategorySectionn from "./FoodCategorySectionn"; // ✅ Correct casing
import AllDishes from "./AllDishes";

export default function AllDishesPage() {
  return (
    <>
      <FoodCategorySectionn />
      <AllDishes />
    </>
  );
}

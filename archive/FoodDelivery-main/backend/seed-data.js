const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Dish = require('./models/Dish');
require('dotenv').config();

// Sample restaurant data
const sampleRestaurants = [
  {
    name: "Domino's Pizza",
    description: "World's leading pizza delivery chain with fresh ingredients and fast delivery",
    photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
    cuisines: ["Italian", "Pizza", "Fast Food"],
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001"
    },
    contact: {
      phone: "+91-9876543210",
      email: "dominos@example.com"
    },
    timings: {
      open: "10:00 AM",
      close: "11:00 PM"
    },
    rating: 4.2,
    deliveryFee: 40,
    minimumOrder: 200
  },
  {
    name: "Le Prive",
    description: "Premium French cuisine with elegant dining experience",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    cuisines: ["French", "Fine Dining", "European"],
    address: {
      street: "456 Luxury Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400002"
    },
    contact: {
      phone: "+91-9876543211",
      email: "leprive@example.com"
    },
    timings: {
      open: "12:00 PM",
      close: "11:00 PM"
    },
    rating: 4.5,
    deliveryFee: 80,
    minimumOrder: 500
  },
  {
    name: "Spice Garden",
    description: "Authentic Indian cuisine with traditional recipes and spices",
    photo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    cuisines: ["Indian", "North Indian", "South Indian"],
    address: {
      street: "789 Spice Lane",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400003"
    },
    contact: {
      phone: "+91-9876543212",
      email: "spicegarden@example.com"
    },
    timings: {
      open: "11:00 AM",
      close: "10:30 PM"
    },
    rating: 4.3,
    deliveryFee: 50,
    minimumOrder: 300
  },
  {
    name: "Sushi Master",
    description: "Fresh Japanese sushi and Asian fusion cuisine",
    photo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    cuisines: ["Japanese", "Sushi", "Asian"],
    address: {
      street: "321 Ocean Drive",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400004"
    },
    contact: {
      phone: "+91-9876543213",
      email: "sushimaster@example.com"
    },
    timings: {
      open: "11:30 AM",
      close: "10:00 PM"
    },
    rating: 4.4,
    deliveryFee: 60,
    minimumOrder: 400
  },
  {
    name: "Burger House",
    description: "Gourmet burgers and American comfort food",
    photo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    cuisines: ["American", "Burgers", "Fast Food"],
    address: {
      street: "654 Burger Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400005"
    },
    contact: {
      phone: "+91-9876543214",
      email: "burgerhouse@example.com"
    },
    timings: {
      open: "10:00 AM",
      close: "12:00 AM"
    },
    rating: 4.1,
    deliveryFee: 35,
    minimumOrder: 150
  }
];

// Sample dish data
const sampleDishes = [
  // Domino's Pizza dishes
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil",
    price: 299,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    category: "Pizza",
    dietaryInfo: ["Vegetarian"],
    preparationTime: 20,
    calories: 285,
    allergens: ["Gluten", "Dairy"],
    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Fresh basil"],
    customizations: [
      { name: "Size", options: ["Regular", "Large", "Extra Large"], prices: [0, 100, 200] },
      { name: "Extra Cheese", options: ["Yes", "No"], prices: [50, 0] }
    ]
  },
  {
    name: "Pepperoni Pizza",
    description: "Spicy pepperoni pizza with melted cheese and tomato sauce",
    price: 399,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    category: "Pizza",
    dietaryInfo: ["Non-Vegetarian"],
    preparationTime: 25,
    calories: 350,
    allergens: ["Gluten", "Dairy", "Pork"],
    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Pepperoni"],
    customizations: [
      { name: "Size", options: ["Regular", "Large", "Extra Large"], prices: [0, 100, 200] },
      { name: "Extra Pepperoni", options: ["Yes", "No"], prices: [75, 0] }
    ]
  },
  {
    name: "Chicken Wings",
    description: "Crispy fried chicken wings with your choice of sauce",
    price: 249,
    image: "https://images.unsplash.com/photo-1567620832904-9d64bcd682f2?w=400",
    category: "Appetizers",
    dietaryInfo: ["Non-Vegetarian"],
    preparationTime: 15,
    calories: 320,
    allergens: ["Gluten", "Eggs"],
    ingredients: ["Chicken wings", "Flour", "Spices", "Hot sauce"],
    customizations: [
      { name: "Sauce", options: ["Buffalo", "BBQ", "Honey Mustard"], prices: [0, 0, 0] },
      { name: "Quantity", options: ["6 pieces", "12 pieces"], prices: [0, 100] }
    ]
  },

  // Le Prive dishes
  {
    name: "Coq au Vin",
    description: "Classic French braised chicken in red wine with mushrooms and pearl onions",
    price: 899,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    category: "Main Course",
    dietaryInfo: ["Non-Vegetarian"],
    preparationTime: 45,
    calories: 450,
    allergens: ["Gluten", "Dairy"],
    ingredients: ["Chicken", "Red wine", "Mushrooms", "Pearl onions", "Bacon"],
    customizations: [
      { name: "Wine Pairing", options: ["Yes", "No"], prices: [200, 0] },
      { name: "Side Dish", options: ["Mashed Potatoes", "Rice", "None"], prices: [100, 80, 0] }
    ]
  },
  {
    name: "Ratatouille",
    description: "Provençal vegetable stew with eggplant, zucchini, and tomatoes",
    price: 599,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    category: "Main Course",
    dietaryInfo: ["Vegetarian", "Vegan"],
    preparationTime: 35,
    calories: 180,
    allergens: [],
    ingredients: ["Eggplant", "Zucchini", "Tomatoes", "Bell peppers", "Onions"],
    customizations: [
      { name: "Cheese Topping", options: ["Yes", "No"], prices: [50, 0] },
      { name: "Bread", options: ["Baguette", "None"], prices: [80, 0] }
    ]
  },

  // Spice Garden dishes
  {
    name: "Butter Chicken",
    description: "Tender chicken in rich tomato and butter gravy with aromatic spices",
    price: 449,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    category: "Main Course",
    dietaryInfo: ["Non-Vegetarian"],
    preparationTime: 30,
    calories: 380,
    allergens: ["Dairy"],
    ingredients: ["Chicken", "Tomato", "Butter", "Cream", "Spices"],
    customizations: [
      { name: "Spice Level", options: ["Mild", "Medium", "Hot"], prices: [0, 0, 0] },
      { name: "Rice", options: ["Basmati", "Jeera", "None"], prices: [80, 90, 0] }
    ]
  },
  {
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in spices and yogurt",
    price: 299,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    category: "Appetizers",
    dietaryInfo: ["Vegetarian"],
    preparationTime: 20,
    calories: 220,
    allergens: ["Dairy"],
    ingredients: ["Paneer", "Yogurt", "Spices", "Onions", "Bell peppers"],
    customizations: [
      { name: "Spice Level", options: ["Mild", "Medium", "Hot"], prices: [0, 0, 0] },
      { name: "Chutney", options: ["Mint", "Tamarind", "Both"], prices: [20, 20, 30] }
    ]
  },

  // Sushi Master dishes
  {
    name: "California Roll",
    description: "Crab, avocado, and cucumber roll with rice and nori",
    price: 399,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    category: "Sushi",
    dietaryInfo: ["Non-Vegetarian"],
    preparationTime: 15,
    calories: 250,
    allergens: ["Fish", "Soy"],
    ingredients: ["Sushi rice", "Nori", "Crab", "Avocado", "Cucumber"],
    customizations: [
      { name: "Wasabi", options: ["Yes", "No"], prices: [0, 0] },
      { name: "Extra Avocado", options: ["Yes", "No"], prices: [50, 0] }
    ]
  },
  {
    name: "Salmon Nigiri",
    description: "Fresh salmon over pressed sushi rice",
    price: 299,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    category: "Sushi",
    dietaryInfo: ["Non-Vegetarian"],
    preparationTime: 10,
    calories: 180,
    allergens: ["Fish"],
    ingredients: ["Sushi rice", "Fresh salmon"],
    customizations: [
      { name: "Wasabi", options: ["Yes", "No"], prices: [0, 0] },
      { name: "Quantity", options: ["2 pieces", "4 pieces"], prices: [0, 150] }
    ]
  },

  // Burger House dishes
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
    price: 299,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    category: "Burgers",
    dietaryInfo: ["Non-Vegetarian"],
    preparationTime: 12,
    calories: 450,
    allergens: ["Gluten", "Dairy", "Beef"],
    ingredients: ["Beef patty", "Cheese", "Lettuce", "Tomato", "Bun", "Special sauce"],
    customizations: [
      { name: "Cheese", options: ["Cheddar", "Swiss", "American"], prices: [0, 20, 0] },
      { name: "Extra Patty", options: ["Yes", "No"], prices: [150, 0] }
    ]
  },
  {
    name: "Veggie Burger",
    description: "Plant-based patty with fresh vegetables and vegan cheese",
    price: 249,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400",
    category: "Burgers",
    dietaryInfo: ["Vegetarian", "Vegan"],
    preparationTime: 15,
    calories: 320,
    allergens: ["Gluten"],
    ingredients: ["Plant-based patty", "Vegan cheese", "Lettuce", "Tomato", "Bun"],
    customizations: [
      { name: "Vegan Cheese", options: ["Yes", "No"], prices: [30, 0] },
      { name: "Avocado", options: ["Yes", "No"], prices: [40, 0] }
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await Restaurant.deleteMany({});
    await Dish.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

// Seed restaurants one by one to handle slug generation
const seedRestaurants = async () => {
  try {
    const restaurants = [];
    for (const restaurantData of sampleRestaurants) {
      const restaurant = new Restaurant(restaurantData);
      await restaurant.save();
      restaurants.push(restaurant);
    }
    console.log(`✅ Seeded ${restaurants.length} restaurants`);
    return restaurants;
  } catch (error) {
    console.error('❌ Error seeding restaurants:', error);
    return [];
  }
};

// Seed dishes with restaurant references
const seedDishes = async (restaurants) => {
  try {
    const restaurantMap = {};
    restaurants.forEach(restaurant => {
      restaurantMap[restaurant.name] = restaurant._id;
    });

    console.log('Restaurant map:', restaurantMap);

    const dishesWithRestaurants = sampleDishes.map(dish => {
      // Assign dishes to restaurants based on cuisine
      let restaurantId;
      if (dish.name.includes('Pizza') || dish.name.includes('Wings')) {
        restaurantId = restaurantMap["Domino's Pizza"];
      } else if (dish.name.includes('Coq') || dish.name.includes('Ratatouille')) {
        restaurantId = restaurantMap["Le Prive"];
      } else if (dish.name.includes('Chicken') || dish.name.includes('Paneer')) {
        restaurantId = restaurantMap["Spice Garden"];
      } else if (dish.name.includes('Roll') || dish.name.includes('Nigiri') || dish.name.includes('Sushi')) {
        restaurantId = restaurantMap["Sushi Master"];
      } else if (dish.name.includes('Burger') || dish.name.includes('Cheeseburger') || dish.name.includes('Veggie')) {
        restaurantId = restaurantMap["Burger House"];
      }
      
      console.log(`Dish: ${dish.name} -> Restaurant ID: ${restaurantId}`);
      
      if (!restaurantId) {
        throw new Error(`No restaurant found for dish: ${dish.name}`);
      }
      
      return {
        ...dish,
        restaurant: restaurantId
      };
    });

    const dishes = await Dish.insertMany(dishesWithRestaurants);
    console.log(`✅ Seeded ${dishes.length} dishes`);
    return dishes;
  } catch (error) {
    console.error('❌ Error seeding dishes:', error);
    return [];
  }
};

// Main seeding function
const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');
  
  await connectDB();
  await clearData();
  
  const restaurants = await seedRestaurants();
  await seedDishes(restaurants);
  
  console.log('✅ Database seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Restaurants: ${restaurants.length}`);
  console.log(`   - Dishes: ${sampleDishes.length}`);
  
  mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

// Run the seeding
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };

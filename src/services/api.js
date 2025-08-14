const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  
  getCurrentUser: () => apiRequest('/auth/me'),
};

// Restaurants API
export const restaurantsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/restaurants?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/restaurants/${id}`),
  
  getBySlug: (slug) => apiRequest(`/restaurants/slug/${slug}`),
  
  getMenu: (id) => apiRequest(`/restaurants/${id}/menu`),
  
  create: (restaurantData) => apiRequest('/restaurants', {
    method: 'POST',
    body: JSON.stringify(restaurantData),
  }),
  
  update: (id, restaurantData) => apiRequest(`/restaurants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(restaurantData),
  }),
  
  delete: (id) => apiRequest(`/restaurants/${id}`, {
    method: 'DELETE',
  }),
};

// Dishes API
export const dishesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/dishes?${queryString}`);
  },
  
  getById: (id) => apiRequest(`/dishes/${id}`),
  
  create: (dishData) => apiRequest('/dishes', {
    method: 'POST',
    body: JSON.stringify(dishData),
  }),
  
  update: (id, dishData) => apiRequest(`/dishes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dishData),
  }),
  
  delete: (id) => apiRequest(`/dishes/${id}`, {
    method: 'DELETE',
  }),
  
  rate: (id, rating) => apiRequest(`/dishes/${id}/rate`, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  }),
};

// Users API
export const usersAPI = {
  getProfile: () => apiRequest('/users/profile'),
  
  updateProfile: (profileData) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  getOrders: () => apiRequest('/users/orders'),
  
  addFavorite: (type, id) => apiRequest('/users/favorites', {
    method: 'POST',
    body: JSON.stringify({ type, id }),
  }),
  
  getFavorites: () => apiRequest('/users/favorites'),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiRequest('/orders'),
  
  getById: (id) => apiRequest(`/orders/${id}`),
  
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

export default {
  auth: authAPI,
  restaurants: restaurantsAPI,
  dishes: dishesAPI,
  users: usersAPI,
  orders: ordersAPI,
};

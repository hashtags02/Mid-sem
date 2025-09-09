const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test health endpoint
async function testHealth() {
  try {
    console.log('🏥 Testing health endpoint...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

// Test restaurants endpoint
async function testRestaurants() {
  try {
    console.log('\n🏪 Testing restaurants endpoint...');
    const response = await axios.get(`${BASE_URL}/restaurants`);
    console.log('✅ Restaurants endpoint working:', response.data);
  } catch (error) {
    console.error('❌ Restaurants endpoint failed:', error.message);
  }
}

// Test dishes endpoint
async function testDishes() {
  try {
    console.log('\n🍽️ Testing dishes endpoint...');
    const response = await axios.get(`${BASE_URL}/dishes`);
    console.log('✅ Dishes endpoint working:', response.data);
  } catch (error) {
    console.error('❌ Dishes endpoint failed:', error.message);
  }
}

// Test user registration
async function testRegistration() {
  try {
    console.log('\n👤 Testing user registration...');
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123'
    };
    
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    console.log('✅ Registration successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return null;
  }
}

// Test user login
async function testLogin() {
  try {
    console.log('\n🔐 Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

// Test protected endpoint
async function testProtectedEndpoint(token) {
  if (!token) {
    console.log('\n🚫 Skipping protected endpoint test (no token)');
    return;
  }
  
  try {
    console.log('\n🔒 Testing protected endpoint...');
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Protected endpoint working:', response.data);
  } catch (error) {
    console.error('❌ Protected endpoint failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealth();
  await testRestaurants();
  await testDishes();
  
  const token = await testRegistration();
  if (!token) {
    await testLogin();
  }
  
  await testProtectedEndpoint(token);
  
  console.log('\n✨ API tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };

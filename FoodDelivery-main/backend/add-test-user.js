const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cravecart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function addTestUser() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ phone: '9081215550' });
    
    if (existingUser) {
      console.log('✅ User already exists:', existingUser);
      return;
    }

    // Create new test user
    const testUser = new User({
      name: 'Test User',
      email: 'test9081215550@example.com',
      phone: '9081215550',
      addresses: [{
        type: 'home',
        address: {
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          landmark: 'Test Landmark'
        },
        isDefault: true
      }],
      isPhoneVerified: true,
      isEmailVerified: true,
      role: 'user'
    });

    await testUser.save();
    console.log('✅ Test user created successfully:', testUser);
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    mongoose.connection.close();
  }
}

addTestUser();

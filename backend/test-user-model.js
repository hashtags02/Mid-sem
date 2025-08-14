const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cravecart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testUserModel() {
  try {
    console.log('🧪 Testing User model creation...');
    
    // Test creating a user with the correct schema
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
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
      isEmailVerified: false,
      role: 'user',
      firebaseUid: 'test-firebase-uid-123'
    });

    console.log('✅ User object created successfully');
    console.log('📝 User data:', JSON.stringify(testUser, null, 2));
    
    // Test validation
    const validationError = testUser.validateSync();
    if (validationError) {
      console.error('❌ Validation error:', validationError.message);
    } else {
      console.log('✅ User validation passed');
    }
    
    // Test saving (optional - comment out if you don't want to create test data)
    // await testUser.save();
    // console.log('✅ User saved to database successfully');
    
  } catch (error) {
    console.error('❌ Error testing User model:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

testUserModel();

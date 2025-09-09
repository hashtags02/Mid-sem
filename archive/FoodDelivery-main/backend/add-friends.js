const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cravecart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add your friends here - just change the phone numbers and names
const friends = [
  {
    name: 'Friend 1',
    email: 'friend1@example.com',
    phone: '9876543210'
  },
  {
    name: 'Friend 2', 
    email: 'friend2@example.com',
    phone: '9876543211'
  },
  {
    name: 'Friend 3',
    email: 'friend3@example.com', 
    phone: '9876543212'
  }
  // Add more friends as needed
];

async function addFriends() {
  try {
    for (const friend of friends) {
      // Check if user already exists
      const existingUser = await User.findOne({ phone: friend.phone });
      
      if (existingUser) {
        console.log(`✅ ${friend.name} already exists with phone ${friend.phone}`);
        continue;
      }

      // Create new friend user
      const newFriend = new User({
        name: friend.name,
        email: friend.email,
        phone: friend.phone,
        addresses: [{
          type: 'home',
          address: {
            street: 'Friend Address',
            city: 'Friend City',
            state: 'Friend State',
            zipCode: '12345',
            landmark: 'Friend Landmark'
          },
          isDefault: true
        }],
        isPhoneVerified: true,
        isEmailVerified: true,
        role: 'user'
      });

      await newFriend.save();
      console.log(`✅ Added ${friend.name} with phone ${friend.phone}`);
    }
    
    console.log('\n🎉 All friends added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding friends:', error);
  } finally {
    mongoose.connection.close();
  }
}

addFriends();

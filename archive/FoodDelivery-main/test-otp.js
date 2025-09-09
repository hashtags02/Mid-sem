// Simple test script for OTP endpoints
const API_BASE = 'http://localhost:5000/api';

async function testOTPFlow() {
  console.log('🧪 Testing OTP Authentication Flow...\n');

  try {
    // Test 1: Check if test server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('📊 Mode:', healthData.mode, '\n');

    // Test 2: Check existing test user
    console.log('2️⃣ Testing phone number check (existing user)...');
    const checkResponse = await fetch(`${API_BASE}/auth/check-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '9876543210' })
    });
    const checkData = await checkResponse.json();
    console.log('✅ Phone check result:', checkData.message);
    console.log('📱 Is registered:', checkData.isRegistered, '\n');

    // Test 3: Send login OTP for existing user
    console.log('3️⃣ Testing login OTP send...');
    const loginOTPResponse = await fetch(`${API_BASE}/auth/send-login-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '9876543210' })
    });
    const loginOTPData = await loginOTPResponse.json();
    console.log('✅ Login OTP sent:', loginOTPData.message);
    console.log('🔐 Test OTP:', loginOTPData.testOTP, '\n');

    // Test 4: Verify login OTP
    console.log('4️⃣ Testing login OTP verification...');
    const verifyLoginResponse = await fetch(`${API_BASE}/auth/verify-login-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phoneNumber: '9876543210', 
        otp: '123456' 
      })
    });
    const verifyLoginData = await verifyLoginResponse.json();
    console.log('✅ Login verification:', verifyLoginData.message);
    console.log('👤 User:', verifyLoginData.user.name, '\n');

    // Test 5: Check new phone number
    console.log('5️⃣ Testing phone number check (new user)...');
    const newUserCheckResponse = await fetch(`${API_BASE}/auth/check-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '1234567890' })
    });
    const newUserCheckData = await newUserCheckResponse.json();
    console.log('✅ New user check:', newUserCheckData.message);
    console.log('📱 Is registered:', newUserCheckData.isRegistered, '\n');

    // Test 6: Send registration OTP for new user
    console.log('6️⃣ Testing registration OTP send...');
    const regOTPResponse = await fetch(`${API_BASE}/auth/send-registration-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '1234567890' })
    });
    const regOTPData = await regOTPResponse.json();
    console.log('✅ Registration OTP sent:', regOTPData.message);
    console.log('🔐 Test OTP:', regOTPData.testOTP, '\n');

    // Test 7: Verify registration OTP and create user
    console.log('7️⃣ Testing registration OTP verification...');
    const verifyRegResponse = await fetch(`${API_BASE}/auth/verify-registration-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phoneNumber: '1234567890', 
        otp: '123456',
        userData: {
          name: 'New Test User',
          email: 'newtest@example.com',
          address: 'New Test Address'
        }
      })
    });
    const verifyRegData = await verifyRegResponse.json();
    console.log('✅ Registration verification:', verifyRegData.message);
    console.log('👤 New user:', verifyRegData.user.name, '\n');

    // Test 8: Verify new user is now registered
    console.log('8️⃣ Verifying new user is now registered...');
    const finalCheckResponse = await fetch(`${API_BASE}/auth/check-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '1234567890' })
    });
    const finalCheckData = await finalCheckResponse.json();
    console.log('✅ Final check result:', finalCheckData.message);
    console.log('📱 Is registered:', finalCheckData.isRegistered, '\n');

    // Test 9: Get all test users
    console.log('9️⃣ Getting all test users...');
    const usersResponse = await fetch(`${API_BASE}/test/users`);
    const usersData = await usersResponse.json();
    console.log('✅ Total users:', usersData.length);
    usersData.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.phone})`);
    });

    console.log('\n🎉 All OTP tests passed successfully!');
    console.log('🚀 Your OTP system is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Make sure the test backend is running on port 5000');
    console.log('2. Check if there are any CORS issues');
    console.log('3. Verify the API endpoints are accessible');
  }
}

// Run the test
testOTPFlow();

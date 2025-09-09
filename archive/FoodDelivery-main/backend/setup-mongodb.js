const fs = require('fs');
const path = require('path');

console.log('🔧 MongoDB Setup Helper');
console.log('=======================\n');

console.log('Option 1: MongoDB Atlas (Recommended)');
console.log('--------------------------------------');
console.log('1. Go to https://www.mongodb.com/atlas');
console.log('2. Create a free account');
console.log('3. Create a new cluster (free tier)');
console.log('4. Click "Connect" on your cluster');
console.log('5. Choose "Connect your application"');
console.log('6. Copy the connection string');
console.log('7. Replace <password> with your database password');
console.log('8. Replace <dbname> with "cravecart"\n');

console.log('Option 2: Local MongoDB');
console.log('----------------------');
console.log('1. Download MongoDB Community Server from:');
console.log('   https://www.mongodb.com/try/download/community');
console.log('2. Install with default settings');
console.log('3. Add MongoDB to your system PATH');
console.log('4. Start MongoDB service\n');

console.log('Environment File Setup:');
console.log('----------------------');
console.log('1. Copy env.example to .env');
console.log('2. Update MONGODB_URI with your connection string');
console.log('3. Set a strong JWT_SECRET\n');

console.log('Example .env file:');
console.log('------------------');
console.log('PORT=5000');
console.log('NODE_ENV=development');
console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cravecart?retryWrites=true&w=majority');
console.log('JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789');
console.log('JWT_EXPIRE=7d');
console.log('FRONTEND_URL=http://localhost:3000\n');

console.log('Next Steps:');
console.log('-----------');
console.log('1. Set up your MongoDB connection');
console.log('2. Create .env file with your settings');
console.log('3. Run: npm install');
console.log('4. Run: npm run dev');
console.log('5. Test with: npm test\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found!');
  console.log('Please create .env file with your MongoDB connection string.\n');
} else {
  console.log('✅ .env file found!');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('⚠️  Dependencies not installed!');
  console.log('Run: npm install\n');
} else {
  console.log('✅ Dependencies installed!');
}

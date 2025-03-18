require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./app/models/user');
const configDB = require('./config/database');

// Get admin credentials from environment variables
const adminUsername = process.env.ADMIN_USERNAME || 'spikeadmin';
const adminPassword = process.env.ADMIN_PASSWORD;

// Check if admin password is provided
if (!adminPassword) {
  console.error('Error: ADMIN_PASSWORD environment variable is required');
  process.exit(1);
}

// Connect to the database
mongoose.connect(configDB.url)
  .then(() => {
    console.log('Connected to database');
    
    // Check if admin user already exists
    return User.findOne({ 'local.email': adminUsername });
  })
  .then(existingAdmin => {
    if (existingAdmin) {
      console.log(`Admin user '${adminUsername}' already exists`);
      return null;
    } else {
      // Create a new admin user
      const adminUser = new User();
      adminUser.local.email = adminUsername;
      adminUser.local.password = adminUser.generateHash(adminPassword);
      
      console.log(`Creating new admin user '${adminUsername}'`);
      return adminUser.save();
    }
  })
  .then(result => {
    if (result) {
      console.log('Admin user created successfully');
    }
    // Close the database connection
    return mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
  });
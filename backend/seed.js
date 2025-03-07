var mongoose = require('mongoose');
var User = require('./app/models/user');
var configDB = require('./config/database');

// Connect to the database
mongoose.connect(configDB.url);

// Create an admin user
var adminUser = new User();
adminUser.local.email = 'spikeadmin';
adminUser.local.password = adminUser.generateHash('jonesMusic25'); // Replace 'adminpassword' with your desired password

// Save the admin user to the database
adminUser.save()
    .then(() => {
        console.log('Admin user created successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error creating admin user:', err);
        mongoose.connection.close();
    });
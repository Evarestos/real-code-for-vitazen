const mongoose = require('mongoose');
const User = require('../models/User');
const Program = require('../models/Program');
const config = require('../config');

async function seedTestData() {
  await mongoose.connect(config.MONGODB_URI);

  await User.deleteMany({});
  await Program.deleteMany({});

  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });

  const programs = [];
  for (let i = 0; i < 100; i++) {
    programs.push({
      user: user._id,
      content: `Test program content ${i}`
    });
  }

  await Program.insertMany(programs);

  console.log('Test data seeded successfully');
  await mongoose.connection.close();
}

seedTestData().catch(console.error);

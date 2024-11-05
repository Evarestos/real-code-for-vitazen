require('dotenv').config({ path: '.env.test' });

jest.mock('winston');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

let token;

beforeEach(async () => {
  await User.deleteMany({});
});

beforeAll(async () => {
  const user = await User.create({
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser'
  });
  token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
});

async function createTestUserAndGetToken() {
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  return { user, token };
}

describe('User API', () => {
  test('Should login user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('Should send password reset email', async () => {
    const response = await request(app)
      .post('/api/users/forgot-password')
      .send({ email: 'test@example.com' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Ένα email με οδηγίες έχει σταλεί στη διεύθυνσή σας');
  });

  test('Should reset password with valid token', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const response = await request(app)
      .post('/api/users/reset-password')
      .send({ token: resetToken, newPassword: 'newpassword123' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Ο κωδικός πρόσβασης άλλαξε επιτυχώς');
  });

  test('Should update user profile', async () => {
    const response = await request(app)
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'updateduser' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('updateduser');
  });
});

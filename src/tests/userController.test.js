const { forgotPassword, resetPassword } = require('../controllers/userController');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

jest.mock('../models/User');
jest.mock('nodemailer');
jest.mock('crypto');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('Should not register a user with existing email', async () => {
    await User.create({
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('Should login a user', async () => {
    await User.create({
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('Should not login with incorrect password', async () => {
    await User.create({
      username: 'wrongpassuser',
      email: 'wrong@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('forgotPassword', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { email: 'test@example.com' }, headers: { host: 'testhost' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  test('should send reset password email for existing user', async () => {
    const mockUser = { 
      email: 'test@example.com',
      save: jest.fn().mockResolvedValue()
    };
    User.findOne.mockResolvedValue(mockUser);
    
    const mockToken = 'mocktoken123';
    crypto.randomBytes.mockReturnValue({
      toString: jest.fn().mockReturnValue(mockToken)
    });

    const mockTransporter = {
      sendMail: jest.fn().mockResolvedValue()
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);

    await forgotPassword(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockUser.resetPasswordToken).toBe(mockToken);
    expect(mockUser.resetPasswordExpires).toBeDefined();
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'test@example.com',
      from: 'noreply@wellnessapp.com',
      subject: 'Επαναφορά Κωδικού Πρόσβασης',
      text: expect.stringContaining(mockToken)
    }));
    expect(res.json).toHaveBeenCalledWith({ message: 'Ένα email με οδηγίες έχει σταλεί στη διεύθυνσή σας' });
  });

  test('should handle non-existent user', async () => {
    User.findOne.mockResolvedValue(null);

    await forgotPassword(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Δεν βρέθηκε χρήστης με αυτό το email' });
  });

  test('should handle email sending error', async () => {
    const mockUser = { 
      email: 'test@example.com',
      save: jest.fn().mockResolvedValue()
    };
    User.findOne.mockResolvedValue(mockUser);
    
    const mockToken = 'mocktoken123';
    crypto.randomBytes.mockReturnValue({
      toString: jest.fn().mockReturnValue(mockToken)
    });

    const mockTransporter = {
      sendMail: jest.fn().mockRejectedValue(new Error('Email sending failed'))
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);

    await forgotPassword(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockUser.resetPasswordToken).toBe(mockToken);
    expect(mockUser.resetPasswordExpires).toBeDefined();
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockTransporter.sendMail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Σφάλμα διακομιστή');
  });
});

describe('resetPassword', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { token: 'validtoken', newPassword: 'newpassword123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  test('should reset password with valid token', async () => {
    const mockUser = {
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: Date.now() + 3600000, // 1 hour from now
      save: jest.fn().mockResolvedValue()
    };
    User.findOne.mockResolvedValue(mockUser);

    await resetPassword(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: { $gt: expect.any(Number) }
    });
    expect(mockUser.password).toBe('newpassword123');
    expect(mockUser.resetPasswordToken).toBeUndefined();
    expect(mockUser.resetPasswordExpires).toBeUndefined();
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Ο κωδικός πρόσβασης άλλαξε επιτυχώς' });
  });

  test('should fail to reset password with invalid token', async () => {
    User.findOne.mockResolvedValue(null);

    await resetPassword(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: { $gt: expect.any(Number) }
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Το token επαναφοράς κωδικού είναι άκυρο ή έχει λήξει' });
  });

  test('should fail to reset password with expired token', async () => {
    const mockUser = {
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: Date.now() - 3600000, // 1 hour ago
    };
    User.findOne.mockResolvedValue(mockUser);

    await resetPassword(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: { $gt: expect.any(Number) }
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Το token επαναφοράς κωδικού είναι άκυρο ή έχει λήξει' });
  });

  test('should handle error when saving new password', async () => {
    const mockUser = {
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: Date.now() + 3600000, // 1 hour from now
      save: jest.fn().mockRejectedValue(new Error('Save error'))
    };
    User.findOne.mockResolvedValue(mockUser);

    await resetPassword(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: { $gt: expect.any(Number) }
    });
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Σφάλμα διακομιστή');
  });
});

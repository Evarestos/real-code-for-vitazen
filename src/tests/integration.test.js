const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Program = require('../models/Program');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Integration Tests', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Program.deleteMany({});

    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    token = res.body.token;
    userId = res.body.user._id;
  });

  test('Should create and retrieve a program', async () => {
    const createRes = await request(app)
      .post('/api/programs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Program',
        description: 'This is a test program'
      });
    expect(createRes.statusCode).toBe(201);
    const programId = createRes.body._id;

    const getRes = await request(app)
      .get(`/api/programs/${programId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.name).toBe('Test Program');
  });

  test('Should update a program', async () => {
    const createRes = await request(app)
      .post('/api/programs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Original Program',
        description: 'This is the original description'
      });
    
    const programId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/api/programs/${programId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Program',
        description: 'This is the updated description'
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.name).toBe('Updated Program');
    expect(updateRes.body.description).toBe('This is the updated description');
  });

  test('Should delete a program', async () => {
    const createRes = await request(app)
      .post('/api/programs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Program to Delete',
        description: 'This program will be deleted'
      });
    
    const programId = createRes.body._id;

    const deleteRes = await request(app)
      .delete(`/api/programs/${programId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe('Program removed');

    const getRes = await request(app)
      .get(`/api/programs/${programId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toBe(404);
  });

  test('Should not access programs of other users', async () => {
    const otherUser = await User.create({
      username: 'otheruser',
      email: 'other@example.com',
      password: 'password123'
    });

    const program = await Program.create({
      name: 'Other User Program',
      description: 'This program belongs to another user',
      user: otherUser._id
    });

    const getRes = await request(app)
      .get(`/api/programs/${program._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toBe(401);
  });
});

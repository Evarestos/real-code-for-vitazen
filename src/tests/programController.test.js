const request = require('supertest');
const app = require('../app');
const Program = require('../models/Program');
const mongoose = require('mongoose');
const { setupTestDB } = require('./testSetup');

setupTestDB();

describe('Program Controller', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Δημιουργία χρήστη και λήψη token
    const userResponse = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    token = userResponse.body.token;
    userId = userResponse.body.user._id;
  });

  test('Should create a new program', async () => {
    const res = await request(app)
      .post('/api/programs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Program',
        description: 'This is a test program'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Test Program');
  });

  test('Should get all personal programs', async () => {
    await Program.create({ name: 'Program 1', description: 'Description 1', user: userId });
    await Program.create({ name: 'Program 2', description: 'Description 2', user: userId });

    const res = await request(app)
      .get('/api/programs')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('Should update a program', async () => {
    const program = await Program.create({ name: 'Old Name', description: 'Old Description', user: userId });

    const res = await request(app)
      .put(`/api/programs/${program._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Name',
        description: 'New Description'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('New Name');
    expect(res.body.description).toBe('New Description');
  });

  test('Should delete a program', async () => {
    const program = await Program.create({ name: 'To Delete', description: 'Will be deleted', user: userId });

    const res = await request(app)
      .delete(`/api/programs/${program._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Program removed');

    const deletedProgram = await Program.findById(program._id);
    expect(deletedProgram).toBeNull();
  });
});

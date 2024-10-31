jest.mock('winston');
const request = require('supertest');
const app = require('../app');

describe('Error Handling', () => {
  test('Should handle 404 errors', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
  });

  test('Should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ username: 'test', email: 'invalid-email', password: 'short' });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});

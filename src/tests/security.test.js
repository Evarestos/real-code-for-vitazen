const request = require('supertest');
const app = require('../app');

describe('Security Tests', () => {
  test('Should reject requests without CSRF token', async () => {
    const res = await request(app)
      .post('/api/programs')
      .send({
        name: 'Test Program',
        description: 'This is a test program'
      });
    
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Invalid CSRF token');
  });
});

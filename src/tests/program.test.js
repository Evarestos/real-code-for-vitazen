require('dotenv').config({ path: '.env.test' });

jest.mock('winston');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Program = require('../models/Program');
const { getProgram, generateProgram, searchPrograms } = require('../controllers/programController');
const aiService = require('../services/aiService');
const cacheService = require('../services/cacheService');

jest.mock('../services/aiService');
jest.mock('../services/cacheService');

let userId;

const createAuthenticatedAgent = async () => {
  const agent = request.agent(app);
  await agent
    .post('/api/users/login')
    .send({ email: 'test@example.com', password: 'password123' });
  return agent;
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST);
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  userId = user._id;
});

afterAll(async () => {
  await User.deleteMany();
  await Program.deleteMany();
  await mongoose.connection.close();
});

jest.setTimeout(30000);

describe('Program API', () => {
  let authenticatedAgent;

  beforeEach(async () => {
    authenticatedAgent = await createAuthenticatedAgent();
  });

  test('Should create a program', async () => {
    const response = await authenticatedAgent
      .post('/api/programs')
      .send({ content: 'New program' });
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe('New program');
  });

  test('Should get all programs', async () => {
    const response = await authenticatedAgent.get('/api/programs');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.programs)).toBeTruthy();
  });

  test('Should update a program', async () => {
    const program = await Program.create({
      user: userId,
      content: 'Initial content'
    });

    const response = await authenticatedAgent
      .patch(`/api/programs/${program._id}`)
      .send({
        content: 'Updated content'
      });
  
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe('Updated content');
  });

  test('Should delete a program', async () => {
    const program = await Program.create({
      user: userId,
      content: 'To be deleted'
    });

    const response = await authenticatedAgent
      .delete(`/api/programs/${program._id}`);
  
    expect(response.statusCode).toBe(200);
  
    const deletedProgram = await Program.findById(program._id);
    expect(deletedProgram).toBeNull();
  });

  test('Should search programs', async () => {
    await Program.create({
      user: userId,
      content: 'Searchable program'
    });

    const response = await authenticatedAgent
      .get('/api/programs/search?q=Searchable');
  
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].content).toContain('Searchable');
  });

  test('Should generate a program', async () => {
    const response = await authenticatedAgent
      .post('/api/programs/generate')
      .send({
        prompt: 'Create a wellness program for beginners'
      });
  
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe('Mocked wellness program');
  });

  test('Should not create a program with empty content', async () => {
    const response = await authenticatedAgent
      .post('/api/programs')
      .send({
        content: ''
      });
  
    expect(response.statusCode).toBe(400);
  });

  test('Should not update a non-existent program', async () => {
    const fakeId = mongoose.Types.ObjectId();
    const response = await authenticatedAgent
      .patch(`/api/programs/${fakeId}`)
      .send({
        content: 'Updated content'
      });
  
    expect(response.statusCode).toBe(404);
  });

  test('Should not access programs without authentication', async () => {
    const response = await request(app).get('/api/programs');
    expect(response.statusCode).toBe(401);
  });

  test('Should create, update, and delete a program', async () => {
    // Create
    const createResponse = await authenticatedAgent
      .post('/api/programs')
      .send({
        content: 'Initial program'
      });
  
    expect(createResponse.statusCode).toBe(201);
    const programId = createResponse.body._id;

    // Update
    const updateResponse = await authenticatedAgent
      .patch(`/api/programs/${programId}`)
      .send({
        content: 'Updated program'
      });
  
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.content).toBe('Updated program');

    // Delete
    const deleteResponse = await authenticatedAgent
      .delete(`/api/programs/${programId}`);
  
    expect(deleteResponse.statusCode).toBe(200);

    // Verify deletion
    const getResponse = await authenticatedAgent
      .get(`/api/programs/${programId}`);
  
    expect(getResponse.statusCode).toBe(404);
  });

  describe('getProgram', () => {
    test('should retrieve a program from cache if available', async () => {
      const mockProgram = { _id: 'testId', content: 'Test Program' };
      cacheService.getOrSet = jest.fn().mockResolvedValue(mockProgram);

      const req = { params: { id: 'testId' }, user: { _id: 'userId' } };
      const res = { json: jest.fn() };

      await getProgram(req, res);

      expect(cacheService.getOrSet).toHaveBeenCalledWith(`program:testId`, expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(mockProgram);
    });

    test('should handle program not found error', async () => {
      cacheService.getOrSet = jest.fn().mockRejectedValue(new Error('Program not found'));

      const req = { params: { id: 'nonExistentId' }, user: { _id: 'userId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await getProgram(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ error: 'Program not found' });
    });

    test('should handle server error', async () => {
      cacheService.getOrSet = jest.fn().mockRejectedValue(new Error('Server error'));

      const req = { params: { id: 'testId' }, user: { _id: 'userId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await getProgram(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('generateProgram', () => {
    test('should generate a new program successfully', async () => {
      const mockGeneratedContent = 'Generated program content';
      aiService.generateWellnessProgram = jest.fn().mockResolvedValue(mockGeneratedContent);
      Program.prototype.save = jest.fn().mockResolvedValue();

      const req = { body: { prompt: 'Test prompt' }, user: { _id: 'userId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await generateProgram(req, res);

      expect(aiService.generateWellnessProgram).toHaveBeenCalledWith('Test prompt');
      expect(Program.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ content: mockGeneratedContent }));
    });

    test('should handle error during program generation', async () => {
      aiService.generateWellnessProgram = jest.fn().mockRejectedValue(new Error('Generation failed'));

      const req = { body: { prompt: 'Test prompt' }, user: { _id: 'userId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await generateProgram(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('searchPrograms', () => {
    test('should return programs matching search term', async () => {
      const mockPrograms = [{ _id: 'testId', content: 'Test Program' }];
      Program.find = jest.fn().mockResolvedValue(mockPrograms);

      const req = { query: { q: 'test' }, user: { _id: 'userId' } };
      const res = { send: jest.fn() };

      await searchPrograms(req, res);

      expect(Program.find).toHaveBeenCalledWith({
        user: 'userId',
        content: { $regex: 'test', $options: 'i' }
      });
      expect(res.send).toHaveBeenCalledWith(mockPrograms);
    });

    test('should handle empty search term', async () => {
      const req = { query: {}, user: { _id: 'userId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await searchPrograms(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Απαιτείται όρος αναζήτησης' });
    });

    test('should handle server error during search', async () => {
      Program.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = { query: { q: 'test' }, user: { _id: 'userId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await searchPrograms(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  // Ποσθέστε περισσότερα tests εδώ για τις υπόλοιπες λειτουργίες
});

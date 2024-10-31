const auth = require('../middleware/auth');
const User = require('../models/User');

jest.mock('../models/User');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      session: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  test('should call next() if user is authenticated', async () => {
    const mockUser = { _id: 'testUserId', name: 'Test User' };
    req.session.userId = 'testUserId';
    User.findById.mockResolvedValue(mockUser);

    await auth(req, res, next);

    expect(User.findById).toHaveBeenCalledWith('testUserId');
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  test('should return 401 if session does not contain userId', async () => {
    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Παρακαλώ πιστοποιηθείτε.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if user is not found in database', async () => {
    req.session.userId = 'nonExistentUserId';
    User.findById.mockResolvedValue(null);

    await auth(req, res, next);

    expect(User.findById).toHaveBeenCalledWith('nonExistentUserId');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Παρακαλώ πιστοποιηθείτε.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle database errors', async () => {
    req.session.userId = 'testUserId';
    User.findById.mockRejectedValue(new Error('Database error'));

    await auth(req, res, next);

    expect(User.findById).toHaveBeenCalledWith('testUserId');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Παρακαλώ πιστοποιηθείτε.' });
    expect(next).not.toHaveBeenCalled();
  });
});

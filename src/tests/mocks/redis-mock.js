module.exports = {
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    on: jest.fn(),
    set: jest.fn(),
    get: jest.fn()
  }))
};

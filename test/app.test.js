const request = require('supertest');
const app = require('../src/app');

describe('Bookstore API', () => {
  it('health endpoint works', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('lists books', async () => {
    const res = await request(app).get('/books');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

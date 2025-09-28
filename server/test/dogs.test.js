import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../src/app.js';
import mongoose from 'mongoose';

let app, token;

describe('Dogs', () => {
  before(async () => {
    process.env.MONGODB_DB = 'dog_adoption_test';
    app = await createApp();
    await request(app).post('/api/auth/register').send({ username: 'bob', password: 'pw' });
    const login = await request(app).post('/api/auth/login').send({ username: 'bob', password: 'pw' });
    token = login.body.token;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('creates and lists my dogs', async () => {
    const r1 = await request(app).post('/api/dogs').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Rex', description: 'friendly' });
    expect(r1.status).to.equal(201);

    const r2 = await request(app).get('/api/dogs/mine').set('Authorization', `Bearer ${token}`);
    expect(r2.status).to.equal(200);
    expect(r2.body.items).to.have.length(1);
  });
});

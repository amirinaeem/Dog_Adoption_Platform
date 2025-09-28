import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../src/app.js';
import mongoose from 'mongoose';

let app;
describe('Auth', () => {
  before(async () => {
    process.env.MONGODB_DB = 'dog_adoption_test';
    app = await createApp();
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('registers and logs in a user', async () => {
    const r1 = await request(app).post('/api/auth/register').send({ username: 'alice', password: 'secret' });
    expect(r1.status).to.equal(201);

    const r2 = await request(app).post('/api/auth/login').send({ username: 'alice', password: 'secret' });
    expect(r2.status).to.equal(200);
    expect(r2.body).to.have.property('token');
  });
});

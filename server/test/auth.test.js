import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../src/app.js';
import mongoose from 'mongoose';

let app;

describe('Auth API', () => {
  before(async () => {
    process.env.MONGODB_DB = 'dog_adoption_test';
    app = await createApp();
  });

  beforeEach(async () => {
    await mongoose.model('User').deleteMany({});
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.username).to.equal('testuser');
      expect(res.body).to.not.have.property('passwordHash');
    });

    it('should not register user with existing username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).to.equal(409);
      expect(res.body.error).to.include('already taken');
    });

    it('should require username and password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: '' });

      expect(res.status).to.equal(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      expect(res.body.user.username).to.equal('testuser');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.status).to.equal(401);
      expect(res.body.error).to.include('Invalid credentials');
    });
  });
});
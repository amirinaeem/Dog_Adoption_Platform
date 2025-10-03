import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../src/app.js';
import mongoose from 'mongoose';

let app, token, otherUserToken;

describe('Dogs API', () => {
  before(async () => {
    process.env.MONGODB_DB = 'dog_adoption_test';
    app = await createApp();
    
    // Register users
    await request(app).post('/api/auth/register').send({ username: 'bob', password: 'password123' });
    await request(app).post('/api/auth/register').send({ username: 'alice', password: 'password123' });
    
    const login = await request(app).post('/api/auth/login').send({ username: 'bob', password: 'password123' });
    const otherLogin = await request(app).post('/api/auth/login').send({ username: 'alice', password: 'password123' });
    
    token = login.body.token;
    otherUserToken = otherLogin.body.token;
  });

  beforeEach(async () => {
    // Clean up before each test
    const Dog = mongoose.model('Dog');
    const Adoption = mongoose.model('Adoption');
    await Dog.deleteMany({});
    await Adoption.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/dogs', () => {
    it('should create a new dog', async () => {
      const res = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Rex', description: 'A very friendly golden retriever' }); // Longer description

      expect(res.status).to.equal(201);
      expect(res.body.name).to.equal('Rex');
      expect(res.body.status).to.equal('PENDING');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/dogs')
        .send({ name: 'Buddy', description: 'A friendly dog' });

      expect(res.status).to.equal(401);
    });

    it('should require name and description', async () => {
      const res = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('required');
    });
  });

  describe('GET /api/dogs/mine', () => {
    it('should list user dogs with pagination', async () => {
      // Create a dog first
      await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Buddy', description: 'A very friendly dog for adoption' });

      const res = await request(app)
        .get('/api/dogs/mine?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('items');
      expect(res.body).to.have.property('total');
      expect(res.body).to.have.property('pages');
      expect(res.body.items).to.be.an('array');
      expect(res.body.items).to.have.length(1);
    });

    it('should filter by status', async () => {
      // Create a pending dog
      await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'PendingDog', description: 'A dog pending for adoption' });

      const res = await request(app)
        .get('/api/dogs/mine?status=PENDING')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.items).to.have.length(1);
      expect(res.body.items[0].status).to.equal('PENDING');
    });
  });

  describe('DELETE /api/dogs/:id', () => {
    it('should remove a dog', async () => {
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'ToDelete', description: 'This dog will be deleted soon' });

      const deleteRes = await request(app)
        .delete(`/api/dogs/${dogRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).to.equal(200);
      expect(deleteRes.body.message).to.include('Removed');
    });

    it('should not remove other users dogs', async () => {
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'OtherDog', description: 'Other users dog for adoption' });

      const deleteRes = await request(app)
        .delete(`/api/dogs/${dogRes.body._id}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(deleteRes.status).to.equal(403);
    });

    it('should not remove adopted dog', async () => {
      // Create a dog and adopt it first
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'AdoptedDog', description: 'This dog will be adopted soon' });

      const dogId = dogRes.body._id;

      // Adopt the dog (need another user to adopt)
      await request(app)
        .post(`/api/adoptions/${dogId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ thankYouMessage: 'Adopting this dog' });

      // Try to delete the adopted dog
      const deleteRes = await request(app)
        .delete(`/api/dogs/${dogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).to.equal(400);
      expect(deleteRes.body.error).to.include('Cannot remove adopted dog');
    });
  });

  describe('GET /api/dogs/:id', () => {
    it('should get dog by id', async () => {
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'SpecificDog', description: 'A very specific dog for testing' });

      const getRes = await request(app)
        .get(`/api/dogs/${dogRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).to.equal(200);
      expect(getRes.body.name).to.equal('SpecificDog');
    });

    it('should return 404 for non-existent dog', async () => {
      const res = await request(app)
        .get('/api/dogs/507f1f77bcf86cd799439011') // Random ObjectId
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('GET /api/dogs', () => {
    it('should list all dogs', async () => {
      // Create some dogs
      await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Dog1', description: 'First dog for adoption listing' });

      await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ name: 'Dog2', description: 'Second dog for adoption listing' });

      const res = await request(app).get('/api/dogs');

      expect(res.status).to.equal(200);
      expect(res.body.items).to.be.an('array');
      expect(res.body.items.length).to.be.at.least(2);
    });

    it('should filter all dogs by status', async () => {
      const res = await request(app).get('/api/dogs?status=PENDING');

      expect(res.status).to.equal(200);
      // All dogs should be pending since we haven't adopted any in this test
      expect(res.body.items.every(dog => dog.status === 'PENDING')).to.be.true;
    });
  });
});
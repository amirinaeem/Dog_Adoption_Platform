import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../src/app.js';
import mongoose from 'mongoose';

let app, ownerToken, adopterToken, foodId;

describe('Adoptions API', () => {
  before(async () => {
    process.env.MONGODB_DB = 'dog_adoption_test';
    app = await createApp();

    // Register and login users
    await request(app).post('/api/auth/register').send({ username: 'owner', password: 'password123' });
    const o = await request(app).post('/api/auth/login').send({ username: 'owner', password: 'password123' });
    ownerToken = o.body.token;

    await request(app).post('/api/auth/register').send({ username: 'adopter', password: 'password123' });
    const a = await request(app).post('/api/auth/login').send({ username: 'adopter', password: 'password123' });
    adopterToken = a.body.token;

    // Create food item
    const foodRes = await request(app)
      .post('/api/foods')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Puppy Kibble', brand: 'GoodBoy', stock: 5 });
    
    foodId = foodRes.body._id;
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

  describe('POST /api/adoptions/:id', () => {
    it('should adopt a dog successfully', async () => {
      // Create a dog
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Max', description: 'A lovely dog for adoption' });
      
      const dogId = dogRes.body._id;

      const res = await request(app)
        .post(`/api/adoptions/${dogId}`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ 
          thankYouMessage: 'Thank you for this wonderful dog!',
          foodSelection: [{ foodId, qty: 2 }]
        });

      expect(res.status).to.equal(201);
      expect(res.body.message).to.include('Adopted');
      expect(res.body).to.have.property('adoptionId');
    });

    it('should not allow adopting own dog', async () => {
      // Create a dog
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Buddy', description: 'My own dog' });
      
      const dogId = dogRes.body._id;

      const res = await request(app)
        .post(`/api/adoptions/${dogId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ thankYouMessage: 'Trying to adopt my own dog' });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('Cannot adopt your own dog');
    });

    it('should not allow adopting already adopted dog', async () => {
      // Create a dog
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Rex', description: 'Already adopted dog' });
      
      const dogId = dogRes.body._id;

      // First adoption
      await request(app)
        .post(`/api/adoptions/${dogId}`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ thankYouMessage: 'First adoption' });

      // Try to adopt the same dog again
      const res = await request(app)
        .post(`/api/adoptions/${dogId}`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ thankYouMessage: 'Second adoption attempt' });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('Dog already adopted');
    });

    it('should handle food selection with insufficient stock', async () => {
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Luna', description: 'Another dog' });
      
      const dogId = dogRes.body._id;

      const res = await request(app)
        .post(`/api/adoptions/${dogId}`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ 
          thankYouMessage: 'Trying with too much food',
          foodSelection: [{ foodId, qty: 100 }] // More than available stock
        });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('Insufficient stock');
    });
  });

  describe('GET /api/adoptions/mine', () => {
    it('should list user adoptions', async () => {
      // Create and adopt a dog
      const dogRes = await request(app)
        .post('/api/dogs')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Charlie', description: 'A dog to be adopted' });
      
      const dogId = dogRes.body._id;

      await request(app)
        .post(`/api/adoptions/${dogId}`)
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ thankYouMessage: 'Thank you!' });

      const res = await request(app)
        .get('/api/adoptions/mine')
        .set('Authorization', `Bearer ${adopterToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('items');
      expect(res.body.items).to.be.an('array');
      expect(res.body.items).to.have.length(1);
    });

    it('should return empty array when no adoptions', async () => {
      const res = await request(app)
        .get('/api/adoptions/mine')
        .set('Authorization', `Bearer ${ownerToken}`); // Owner hasn't adopted any dogs

      expect(res.status).to.equal(200);
      expect(res.body.items).to.be.an('array');
      expect(res.body.items).to.have.length(0);
    });
  });
});
import { expect } from 'chai';
import request from 'supertest';
import { createApp } from '../src/app.js';
import mongoose from 'mongoose';

let app, ownerToken, adopterToken, dogId;

describe('Adoptions', () => {
  before(async () => {
    process.env.MONGODB_DB = 'dog_adoption_test';
    app = await createApp();

    await request(app).post('/api/auth/register').send({ username: 'owner', password: 'pw' });
    const o = await request(app).post('/api/auth/login').send({ username: 'owner', password: 'pw' });
    ownerToken = o.body.token;

    await request(app).post('/api/auth/register').send({ username: 'adopter', password: 'pw' });
    const a = await request(app).post('/api/auth/login').send({ username: 'adopter', password: 'pw' });
    adopterToken = a.body.token;

    const d = await request(app).post('/api/dogs').set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Milo', description: 'cute' });
    dogId = d.body._id;

    // seed a food item
    await request(app).post('/api/foods').set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Puppy Kibble', brand: 'GoodBoy', stock: 5 });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('adopts a dog with food selection', async () => {
    const foods = await request(app).get('/api/foods');
    const foodId = foods.body[0]._id;

    const r = await request(app).post(`/api/adoptions/${dogId}`)
      .set('Authorization', `Bearer ${adopterToken}`)
      .send({ thankYouMessage: 'Thanks!', foodSelection: [{ foodId, qty: 2 }] });

    expect(r.status).to.equal(201);
    expect(r.body).to.have.property('adoptionId');
  });
});

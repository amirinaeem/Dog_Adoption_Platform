# 🐾 Dog Adoption Platform

A **full-stack web application** that connects dogs in need of homes with loving adopters.  
This project goes beyond a simple API assignment by delivering:

- A secure **backend API** (Node.js, Express, MongoDB Atlas, JWT auth).  
- A modern **frontend** (React + Vite, React Router, Axios).  
- Extended features like a **Dog Food Bank** for selecting supplies during adoption.  
- A layered, production-ready architecture with tests, Docker support, and deployment configs.

---

## ✨ Features

### 🔐 Authentication
- User registration and login with **bcrypt password hashing**.  
- **JWT-based auth** with token expiration (24h).  
- Protected routes for managing dogs, adoptions, and food.

### 🐕 Dog Management
- Register a dog for adoption (name, description, optional photo).  
- Remove dogs (only by owner, unless already adopted).  
- Browse dogs with **filters** (status: available/adopted) and **pagination**.

### 💌 Adoptions
- Adopt a dog (with thank-you message to the original owner).  
- Restrictions:
  - A dog can’t be adopted twice.  
  - Users can’t adopt their own dogs.  
- Track your adopted dogs with pagination.  

### 🍖 Food Bank (Extra Feature)
- List of food options available for adopted dogs.  
- Users can select food during adoption.  
- Food stock managed by the platform.

### 📦 Extras
- Proper error handling and meaningful status codes.  
- CORS enabled for frontend ↔ backend communication.  
- Environment variables for secrets/config.  
- **Tests** with Mocha, Chai, and Supertest.  
- **Dockerfile + render.yaml** for easy deployment.

---

## 🗂 Project Structure

```plaintext
dog-adoption-platform/
├─ server/                    # Backend API
│  ├─ src/
│  │  ├─ app.js               # Express app entry
│  │  ├─ db.js                # MongoDB connection
│  │  ├─ routes/              # Route definitions
│  │  ├─ controllers/         # Request handlers
│  │  ├─ models/              # Mongoose schemas
│  │  ├─ middlewares/         # Auth, error, rate limiting
│  │  └─ utils/jwt.js         # JWT helper
│  ├─ test/                   # API tests
│  ├─ .env.example            # Example env vars
│  ├─ Dockerfile              # Containerization
│  └─ render.yaml             # Deployment config
│
├─ web/                       # Frontend React app
│  ├─ src/
│  │  ├─ pages/               # Routes: Home, Dogs, Adopt, etc.
│  │  ├─ components/          # Header, Loader, Guard
│  │  ├─ api.js               # Axios wrapper for API calls
│  │  ├─ auth.jsx             # Auth context provider
│  │  ├─ main.jsx, App.jsx    # App entry
│  │  └─ styles.css           # Styling
│  ├─ index.html
│  ├─ vite.config.js
│  └─ .env.example
│
├─ package.json               # Root scripts for dev/prod
└─ README.md                  # This file

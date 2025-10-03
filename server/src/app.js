/** app.js — Express bootstrap: security, CORS, routes, start server */
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './db.js';
import routes from './routes/index.routes.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

export async function createApp() {
  await connectDB(process.env.MONGODB_URI);
  const app = express();
  
  // CORS configuration - MUST BE FIRST MIDDLEWARE
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log('CORS blocked for origin:', origin);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  
  // Body parsing middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan('dev'));

  // Routes
  app.use('/api', routes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      const app = await createApp();
      const port = process.env.PORT || 4000;
      app.listen(port, () => {
        console.log(`🚀 API server running on http://localhost:${port}`);
        console.log(`🌐 CORS enabled for: localhost:5173, 127.0.0.1:5173`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  })();
}
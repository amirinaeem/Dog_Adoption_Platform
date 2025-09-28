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
  app.use(helmet());
  app.use(cors({
  origin: (origin, cb) => {
    const allowed = (process.env.CORS_ORIGIN || '').split(',');
    if (!origin || allowed.includes(origin)) cb(null, true);
    else cb(new Error('CORS blocked'));
  },
  credentials: true,
}));

  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));
  app.use('/api', routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    const app = await createApp();
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`🚀 API listening http://localhost:${port}`));
  })();
}

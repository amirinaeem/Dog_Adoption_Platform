/** error.middleware.js — 404 + centralized error handler */
export function notFound(req, res) {
  res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: Object.values(err.errors).map(e => e.message) 
    });
  }
  
  // Mongongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate entry' });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message 
  });
}
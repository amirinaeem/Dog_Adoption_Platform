/** error.middleware.js — 404 + centralized error handler */
export function notFound(req, res) {
  res.status(404).json({ error: 'Not Found' });
}
export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
}

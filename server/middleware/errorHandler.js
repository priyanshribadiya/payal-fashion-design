import { ENV } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  // Structured logging (safeguard against logging secrets)
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `An account or record with that ${field} already exists.`,
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    ...(ENV.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}

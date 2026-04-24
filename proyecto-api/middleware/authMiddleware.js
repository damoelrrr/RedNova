// filepath: proyecto-api/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');

/**
 * Middleware de autenticación JWT
 * Verifica el token y adjunta el usuario a la request
 */

/**
 * Extrae el token del header Authorization
 * @param {string} authHeader - Header Authorization
 * @returns {string|null} - Token o null
 */
const extractToken = (authHeader) => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Middleware: Verifica que el usuario esté autenticado
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación no proporcionado'
      });
    }

    // Verificar el token
    const decoded = verifyToken(token);

    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Cuenta desactivada'
      });
    }

    // Adjuntar el usuario a la request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (error.message === 'Token expirado') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado, por favor inicia sesión nuevamente'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/**
 * Middleware: Verifica que el usuario tenga rol de administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }

  next();
};

/**
 * Middleware: Verifica que el usuario tenga rol de moderador o administrador
 */
const requireModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }

  if (!['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de moderador'
    });
  }

  next();
};

/**
 * Middleware: Verifica roles específicos
 * @param {string[]} roles - Array de roles permitidos
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Roles permitidos: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireAdmin,
  requireModerator,
  requireRole,
  extractToken
};
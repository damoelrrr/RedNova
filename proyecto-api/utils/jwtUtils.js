// filepath: proyecto-api/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Utilería JWT para generación y verificación de tokens
 */

// Cargar configuración desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'rednova-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

/**
 * Genera un token de acceso JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} - Token JWT
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Genera un token de refresh JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} - Token JWT de refresh
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN
  });
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token a verificar
 * @returns {Object} - Payload decodificado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw new Error('Error al verificar el token');
  }
};

/**
 * Decodifica un token sin verificar (para lectura rápida)
 * @param {string} token - Token a decodificar
 * @returns {Object} - Payload decodificado
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Genera un par de tokens (access + refresh)
 * @param {Object} user - Usuario para generar el token
 * @returns {Object} - { accessToken, refreshToken, expiresIn }
 */
const generateTokenPair = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user._id });

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateTokenPair,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN
};
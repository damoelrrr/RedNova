// filepath: proyecto-api/utils/authUtils.js
const bcrypt = require('bcrypt');

/**
 * Utilería de autenticación con bcrypt
 * Maneja el hash y comparación de contraseñas
 */

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Contraseña hasheada
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error al hashear la contraseña');
  }
};

/**
 * Compara una contraseña con su hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado
 * @returns {Promise<boolean>} - true si coincide
 */
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Error al comparar la contraseña');
  }
};

/**
 * Verifica la fortaleza de una contraseña
 * @param {string} password - Contraseña a verificar
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }
  if (password.length > 50) {
    errors.push('La contraseña no puede exceder 50 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePassword
};
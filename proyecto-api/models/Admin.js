// filepath: proyecto-api/models/Admin.js
const mongoose = require('mongoose');
const User = require('./User');

// Schema específico para administradores
const adminSchema = new mongoose.Schema({
  // Hereda todos los campos de User: username, email, password, avatar, bio, role, isActive, createdAt, updatedAt
  // Campos adicionales específicos para administrador:
  adminLevel: {
    type: String,
    enum: ['super_admin', 'admin', 'sub_admin'],
    default: 'admin'
  },
  permissions: {
    canManageUsers: { type: Boolean, default: true },
    canManageModerators: { type: Boolean, default: true },
    canViewLogs: { type: Boolean, default: true },
    canManageSettings: { type: Boolean, default: true },
    canManageCommunities: { type: Boolean, default: true },
    canDeleteAnyContent: { type: Boolean, default: true },
    canAssignRoles: { type: Boolean, default: true }
  },
  managedCommunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }],
  adminStats: {
    usersCreated: { type: Number, default: 0 },
    moderatorsAssigned: { type: Number, default: 0 },
    systemChanges: { type: Number, default: 0 }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  // Token para recuperación de cuenta de admin
  recoveryToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Crear modelo de administrador usando el discriminator de Mongoose
const Admin = User.discriminator('admin', adminSchema);

module.exports = Admin;
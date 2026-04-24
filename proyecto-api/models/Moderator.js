// filepath: proyecto-api/models/Moderator.js
const mongoose = require('mongoose');
const User = require('./User');

// Schema específico para moderadores
const moderatorSchema = new mongoose.Schema({
  // Hereda todos los campos de User: username, email, password, avatar, bio, role, isActive, createdAt, updatedAt
  // Campos adicionales específicos para moderador:
  moderatedCommunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }],
  permissions: {
    canBan: { type: Boolean, default: true },
    canDelete: { type: Boolean, default: true },
    canLock: { type: Boolean, default: true },
    canPin: { type: Boolean, default: true },
    canApprove: { type: Boolean, default: true }
  },
  moderationStats: {
    postsRemoved: { type: Number, default: 0 },
    commentsRemoved: { type: Number, default: 0 },
    usersBanned: { type: Number, default: 0 },
    warningsIssued: { type: Number, default: 0 }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Crear modelo de moderador usando el discriminator de Mongoose
// Esto permite tener una colección separada pero con la estructura del usuario base
const Moderator = User.discriminator('moderator', moderatorSchema);

module.exports = Moderator;
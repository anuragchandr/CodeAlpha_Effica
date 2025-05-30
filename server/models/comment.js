// backend/models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Username from JWT
  text: { type: String, required: true },
  time: { type: String, default: () => new Date().toISOString() },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'signupDB', required: true },
});

module.exports = mongoose.model('Comment', CommentSchema, 'comments');
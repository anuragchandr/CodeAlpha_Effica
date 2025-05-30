// backend/models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'signupDB', required: true },
  tasks: [{
    title: { type: String, required: true },
    assignee: { type: String, required: true },
    dueDate: { type: String, required: true },
    completed: { type: Boolean, default: false },
  }],
});

module.exports = mongoose.model('Project', ProjectSchema, 'projects');
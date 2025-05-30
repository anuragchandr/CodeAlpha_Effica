require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SignupModel = require('./models/signupDB');
const ProjectModel = require('./models/project');
const CommentModel = require('./models/comment');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/', (req, res) => {
  res.send({
    activeStatus: 'Server is running',
    error: false,
  });
}
);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error details:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
});

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Updated registration endpoint
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      required: ['name', 'email', 'password']
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Invalid email format'
    });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    // Check for existing user
    const existingUser = await SignupModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Email already registered'
      });
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await SignupModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send success response
    res.status(201).json({ 
      message: 'Registration successful',
      user: { 
        id: newUser._id,
        name: newUser.name, 
        email: newUser.email 
      },
      token
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid input data',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    // Handle other errors
    res.status(500).json({ 
      message: 'Server error during registration'
    });
  }
});

// Updated login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await SignupModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: { name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Create project
app.post('/api/projects', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  try {
    const project = await ProjectModel.create({
      title,
      description,
      userId: req.user.id,
      tasks: [],
    });
    res.json({ message: 'Project created', project });
  } catch (err) {
    console.error('❌ Error creating project:', err);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Add task/subtask
app.post('/api/projects/:projectId/tasks', authenticateToken, async (req, res) => {
  const { projectId } = req.params;
  const { title, assignee, dueDate } = req.body;
  try {
    const project = await ProjectModel.findOne({ _id: projectId, userId: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.tasks.push({ title, assignee, dueDate, completed: false });
    await project.save();
    res.json({ message: 'Task added', project });
  } catch (err) {
    console.error('❌ Error adding task:', err);
    res.status(500).json({ message: 'Error adding task' });
  }
});

// Fetch projects for user
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await ProjectModel.find({ userId: req.user.id });
    res.json({ projects });
  } catch (err) {
    console.error('❌ Error fetching projects:', err);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Update task completion
app.patch('/api/projects/:projectId/tasks/:taskId', authenticateToken, async (req, res) => {
  const { projectId, taskId } = req.params;
  const { completed } = req.body;
  try {
    const project = await ProjectModel.findOne({ _id: projectId, userId: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.completed = completed;
    await project.save();
    res.json({ message: 'Task updated', project });
  } catch (err) {
    console.error('❌ Error updating task:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

app.post('/api/comments', authenticateToken, async (req, res) => {
  const { text } = req.body;
  try {
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    const comment = await CommentModel.create({
      user: req.user.name,
      text: text.trim(),
      userId: req.user.id,
    });
    res.json({ message: 'Comment posted', comment });
  } catch (err) {
    console.error('❌ Error posting comment:', err);
    res.status(500).json({ message: 'Error posting comment' });
  }
});

// Fetch comments
app.get('/api/comments', authenticateToken, async (req, res) => {
  try {
    const comments = await CommentModel.find({ userId: req.user.id });
    res.json({ comments });
  } catch (err) {
    console.error('❌ Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
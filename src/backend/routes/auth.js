
const express = require('express');
const router = express.Router();

// Mock users for demonstration
const users = [
  { id: 1, username: 'doctor', password: 'password', name: 'Dr. John Doe', role: 'doctor' },
  { id: 2, username: 'nurse', password: 'password', name: 'Nurse Sarah', role: 'nurse' },
  { id: 3, username: 'admin', password: 'password', name: 'Admin User', role: 'admin' }
];

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // In a real app, you would generate a JWT token here
  const token = 'mock-jwt-token-' + user.id;
  
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  });
});

// Get current user
router.get('/me', (req, res) => {
  // In a real app, you would verify the JWT token
  // and return the user data based on the token
  
  // For demo purposes, we'll just return a mock user
  res.json({
    id: 1,
    name: 'Dr. John Doe',
    role: 'doctor'
  });
});

// Logout route
router.post('/logout', (req, res) => {
  // In a real app, you might blacklist the token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;

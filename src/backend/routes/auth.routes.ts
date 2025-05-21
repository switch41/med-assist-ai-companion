import { Router } from 'express';

const router = Router();

// Login route
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

// Register route
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

// Logout route
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint' });
});

export default router; 
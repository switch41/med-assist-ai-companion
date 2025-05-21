import { Router } from 'express';

const router = Router();

// Get provider profile
router.get('/profile', (req, res) => {
  res.json({ message: 'Provider profile endpoint' });
});

// Update provider profile
router.put('/profile', (req, res) => {
  res.json({ message: 'Update provider profile endpoint' });
});

// Get provider's patients
router.get('/patients', (req, res) => {
  res.json({ message: 'Provider patients endpoint' });
});

export default router; 
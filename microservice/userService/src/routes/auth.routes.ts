import express from 'express';
import { GetMe, Login, Logout, Register, updateMe, updatePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);
router.get('/me', protect, GetMe);
router.put('/update-password',protect, updatePassword);
router.put('/update-me', protect, updateMe);

export default router;

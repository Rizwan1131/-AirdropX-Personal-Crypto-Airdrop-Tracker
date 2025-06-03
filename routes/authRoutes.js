import express from 'express';
import { signup, verifyEmail, login } from '../controller/user.controller.js'


const router = express.Router();

router.post('/signup', signup);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);

export default router;

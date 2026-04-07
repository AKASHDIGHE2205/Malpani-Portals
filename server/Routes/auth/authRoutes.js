import express from 'express';
import { registerUser, loginUser, sendOtp, validateOtp, updatePassword } from '../../controller/auth/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/sendotp', sendOtp);
router.post('/validateotp', validateOtp);
router.post('/updateotp', updatePassword);

export default router;
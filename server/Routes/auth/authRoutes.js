import express from 'express';
import { registerUser, loginUser, sendOtp, validateOtp, updatePassword, getAllUsers, editUser } from '../../controller/auth/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/sendotp', sendOtp);
router.post('/validateotp', validateOtp);
router.post('/updateotp', updatePassword);

// ---------------- USER MASTERS ----------------//
router.get('/getAllUsers', getAllUsers);
router.put('/editUser', editUser);

export default router;
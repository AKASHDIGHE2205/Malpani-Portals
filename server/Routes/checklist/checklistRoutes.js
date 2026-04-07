import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllQuestions,
  getLocations,
  getUsers,
  updateQuestion,
  updateUser
} from "../../controller/checklist/masterController.js";
import {
  approveOrReject,
  getAdminTransaction,
  getCompletedQuestions,
  getQuestions,
  getTransactions,
  storeAdminTransaction,
  storeTransaction
} from '../../controller/checklist/tranController.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ IMPORTANT CHANGE (same pattern as plot)
const uploadDir = path.join(__dirname, '../../uploads/checklist');

// ✅ FIX: recursive folder creation
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

// Routes
router.get('/locations', getLocations);
router.get('/get-users', getUsers);
router.put('/update-users', updateUser);
router.post('/all-questions', getAllQuestions);
router.put('/update-questions', updateQuestion);

// TranRoutes
router.post('/transactions', upload.array('images'), storeTransaction);
router.post('/get-transactions', getTransactions);
router.get('/get-qcompleted/:u_id', getCompletedQuestions);
router.post('/get-questions', getQuestions);
router.post('/approve-reject', approveOrReject);
router.post('/admin-transaction', storeAdminTransaction);
router.get('/get-admin-transaction', getAdminTransaction);

export default router;
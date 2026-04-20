import express from "express";
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { AddPlotProperty, getAllProjects, getPlotsFromStatus, getProjectDetails, UpdatePlotProperty, updatePlotMaster, generateReport1 } from "../../controller/plot/plotController.js";
// import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads/plots');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.post('/AddPlotProperty', upload.single('file'), AddPlotProperty);
router.get('/getAllProjects', getAllProjects);
router.get("/getProjectDetails/:project_id", getProjectDetails);
router.put('/UpdatePlotProperty', UpdatePlotProperty);
router.put('/updatePlotMaster', updatePlotMaster);
router.post("/getPlotsFromStatus", getPlotsFromStatus);
router.post("/generateReport1", generateReport1);

// router.get("/getProjectDetails/:project_id",authenticateToken, getProjectDetails);
// router.get('/getAllProjects',authenticateToken, getAllProjects);
// router.post("/getPlotsFromStatus",authenticateToken,getPlotsFromStatus)

export default router;
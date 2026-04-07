import express from "express";
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { AddPlotProperty, getAllProjects, getProjectDetails, getProjectPlotById, UpdatePlotProperty } from "../../controller/plot/plotController.js";


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
router.get('/getAllProjects',getAllProjects);
router.get("/getProjectDetails/:project_id", getProjectDetails);
router.get('/project/:project_id/plot/:plot_sr', getProjectPlotById);
router.put('/UpdatePlotProperty', UpdatePlotProperty);


export default router;

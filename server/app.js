import bodyParser from "body-parser";
import cors from "cors";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./Routes/auth/authRoutes.js";
import checklistRoutes from "./Routes/checklist/checklistRoutes.js";
import plotRoutes from "./Routes/plot/plotRoutes.js";
import postRoutes from "./Routes/post/postRoutes.js";
import propertyRoutes from "./Routes/property/propertyRoutes.js";
import storeRoutes from "./Routes/store/storeRoutes.js";
import storeauthRoutes from "./Routes/storeauth/authRoutes.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 2000;

app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
// app.use(bodyParser.json());
// Increase the limit to 50MB or adjust as needed
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Or if you're using Express 4.16+
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/store/auth', storeauthRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/plot', plotRoutes);

app.use('/uploads', express.static('uploads'));
app.use('/api/checklist', checklistRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
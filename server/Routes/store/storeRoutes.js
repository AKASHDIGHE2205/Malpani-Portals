import express from 'express';
import {
  getAllFirms, createFirm, updateFirm,
  getAllBranches, createBranch, updateBranch,
  getAllCategories, createCategory, updateCategory,
  getAllLocations, createLocation, updateLocation,
  getAllSections, createSection, updateSection
} from '../../controller/store/storeMasterController.js';
import {
  getAllTranEntries,
  getDisposedFiles,
  newTranEntry,
  getTranEntryById,
  updateTranEntry,
  getActiveFirms,
  getActiveBranches,
  getActiveCategories,
  getActiveLocations,
  getActiveSections,
} from "../../controller/store/storeTranController.js";
import {
  getEntryStatus,
  branchWiseReport,
  firmWiseReport,
  yearWiseReport, branchFirmWiseReport, getReportData
} from "../../controller/store/storeReportController.js";

const router = express.Router();

// Firms
router.get('/getAllFirms', getAllFirms);
router.post('/newFirm', createFirm);
router.put('/editFirm', updateFirm);

// Branches
router.get('/getAllBranches', getAllBranches);
router.post('/newBranch', createBranch);
router.put('/editBranch', updateBranch);

// Categories
router.get('/getAllcatgs', getAllCategories);
router.post('/newCatg', createCategory);
router.put('/editCatg', updateCategory);

// Locations
router.get('/getAllLocations', getAllLocations);
router.post('/newLocation', createLocation);
router.put('/editLocation', updateLocation);

// Sections
router.get('/getAllSections', getAllSections);
router.post('/newSection', createSection);
router.put('/editSection', updateSection);

// Transaction entries
router.post("/getAllTranEntries", getAllTranEntries);
router.post("/get-desposed-files", getDisposedFiles);
router.post("/newTranEntry", newTranEntry);
router.get("/getTranEntry/:id", getTranEntryById);
router.put("/updateTranEntry", updateTranEntry);

// Active data
router.get("/getActiveFirms", getActiveFirms);
router.get("/getActiveBranches", getActiveBranches);
router.get("/getActivecatgs", getActiveCategories);
router.get("/getActiveLocations", getActiveLocations);
router.get("/getActiveSections", getActiveSections);

// Define routes
router.get("/getEntryStatus", getEntryStatus);
router.post("/branch-wise-report", branchWiseReport);
router.post("/firm-wise-report", firmWiseReport);
router.post("/year-wise-report", yearWiseReport);
router.post("/firm-branch-wise-report", branchFirmWiseReport)
router.get("/getReportData", getReportData)

export default router;

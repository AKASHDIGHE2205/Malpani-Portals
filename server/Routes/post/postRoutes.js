import express from "express";
import { loginUser, registerUser } from "../../controller/post/postAuthController.js";
import { getInOutReports, getInOutSum } from "../../controller/post/postReportController.js"
import {
  getDepts, getPTypes, getFirms, newEntry, getAllInEntry, updateInEntry, delInOutEntry,
  getAllOutEntry, newOutEntry, updateOutEntry, newStampEntry, getAllStampEntry, updateStampEntry,
  delStampEntry, newVoucherEntry, getAllVoucherEntry, updateVEntry, delVEntry, getAllOutwardDetails,
  updateOutwardDetails, viewGroup, newGroup, editGroup, delGroup, getEditFormData
}
  from "../../controller/post/postTranCOntroller.js"
const router = express.Router();

// Login API
router.post("/log-in", loginUser);
router.post("/registration", registerUser);

//Report Routes
router.post("/getInOutReports", getInOutReports);
router.post("/getInOutSum", getInOutSum);


//Api to get All Dept's for Entry modal view
router.get("/getDepts", getDepts);
router.get("/getPTypes", getPTypes);
router.get("/getFirms", getFirms);
router.post('/newEntry', newEntry);
router.post("/getAllInEntry", getAllInEntry);
router.put("/updateInEntry", updateInEntry);
router.put("/delInOutEntry", delInOutEntry);
router.post("/getAllOutEntry", getAllOutEntry);
router.post("/getEditOutFormData", getEditFormData)
router.post("/newOutEntry", newOutEntry);
router.put("/updateOutEntry", updateOutEntry)
router.put("/updateOutEntry",);
router.post("/newStampEntry", newStampEntry);
router.get("/getAllStampEntry", getAllStampEntry);
router.put("/updateStampEntry", updateStampEntry);
router.delete("/delStampEntry/:id", delStampEntry)
router.post("/newVoucherEntry", newVoucherEntry);
router.get("/getAllVoucherEntry", getAllVoucherEntry);
router.put("/updateVEntry", updateVEntry);
router.delete("/delVEntry/:id", delVEntry);
router.post("/getAllOutwardDetails", getAllOutwardDetails);
router.put("/updateOutwardDetails", updateOutwardDetails);
router.post("/viewGroup", viewGroup);
router.post("/newGroup", newGroup);
router.put("/editGroup", editGroup);
router.put("/delGroup", delGroup);

export default router;
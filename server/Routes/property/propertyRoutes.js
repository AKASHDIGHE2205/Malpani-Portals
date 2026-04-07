import express from "express";
import {
  getAllConsignor,
  newConsignor,
  editConsignor,
  getAllConsignee,
  newConsignee,
  editConsignee,
  getAllDocument,
  newDocument,
  editDocument,
  getAllPLocation,
  newPLocation,
  editPLocation,
} from "../../controller/property/propMasterController.js";
import {
  getActiveConsignor, getActiveConsignee, getActivePLocation, getActiveDocument,
  getTransactionData_old, getEditPTran_old, newPtranOld, editPTransaction_old, deletePTransaction_old,
  newPropertyTran, getTransactionData1, getPtranData, updatePTran, newDeletePTransaction,
  getSaleModalDat, getSaleProperty, newSaleProperty_old, newSaleProperty, getAllSaledProp, updateSaledProp
} from "../../controller/property/propTranController.js"
import { propertyRegisterOld, locationwiseRegister, locationServeyRegister, propertyRegister } from "../../controller/property/propReportController.js"

import multer from 'multer';

// Configure multer to store files with unique names
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const router = express.Router();
const upload = multer({ storage });

// Consignor
router.get("/getAllConsignor", getAllConsignor);
router.post("/newConsignor", newConsignor);
router.put("/editConsigner", editConsignor);

// Consignee
router.get("/getAllConsignee", getAllConsignee);
router.post("/newConsignee", newConsignee);
router.put("/editConsignee", editConsignee);

// Document
router.get("/getAllDocument", getAllDocument);
router.post("/newDocument", newDocument);
router.put("/editDocument", editDocument);

// Property Location
router.get("/getAllPLocation", getAllPLocation);
router.post("/newPLocation", newPLocation);
router.put("/editPLocation", editPLocation);



router.get('/getActiveConsignor', getActiveConsignor);
router.get('/getActiveConsignee', getActiveConsignee);
router.get('/getActivePLocation', getActivePLocation);
router.get('/getActiveDocument', getActiveDocument);


//-------------- Old Api Transaction Data  ---------------//
router.post('/getTransactionData_old', getTransactionData_old);
router.post('/getEditPTran_old', getEditPTran_old);
router.post('/new-ptran_old', upload.any(), newPtranOld);
router.put('/editPTransaction_old', editPTransaction_old);
router.put('/deletePTransaction_old', deletePTransaction_old);


//-------------- New Api Transaction Data  ---------------//
router.post('/new-property-tran', upload.any(), newPropertyTran);
router.post('/getTransactionData1', getTransactionData1);
router.get("/getPtranData/:id", getPtranData);
router.put("/updatePTran", updatePTran);
router.put('/newDeletePTransaction', newDeletePTransaction);


//-------------- Sale Transaction API --------------//
router.get('/getSaleModalData', getSaleModalDat);
router.post("/getSaleProperty", getSaleProperty);
router.post("/newSaleProperty_old", newSaleProperty_old);
router.post("/newSaleProperty", newSaleProperty);
router.post("/getAllSaledProp", getAllSaledProp);
router.put("/updateSaledProp", updateSaledProp);

//-------------- Sale Report API --------------//
router.post('/property-register_old', propertyRegisterOld);
router.post('/locationwise-register', locationwiseRegister);
router.get('/location-servey-register', locationServeyRegister);
router.post("/property-register", propertyRegister);

export default router;

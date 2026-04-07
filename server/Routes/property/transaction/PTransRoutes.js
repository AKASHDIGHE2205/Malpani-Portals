import express from 'express';
import db from '../../../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import util from "util";

const query = util.promisify(db.query).bind(db);
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure multer to store files with unique names
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/getActiveConsignor', (req, res) => {
  const sql = `SELECT * 
               FROM st_consignor 
               WHERE status = 'A'
               ORDER BY name ASC`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred while fetching data", error: err });
    }
    res.status(200).json(results);
  });
});
router.get('/getActiveConsignee', (req, res) => {
  const sql = `SELECT * 
               FROM st_consignee 
               WHERE status = 'A'
               ORDER BY name ASC`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred while fetching data", error: err });
    }
    res.status(200).json(results);
  });
});
router.get('/getActivePLocation', (req, res) => {
  const sql = `SELECT * 
               FROM st_ploc 
               WHERE status = 'A'
               ORDER BY name ASC`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred while fetching data", error: err });
    }
    res.status(200).json(results);
  });
});
router.get('/getActiveDocument', (req, res) => {
  const sql = `SELECT * 
               FROM st_doc 
               WHERE status = 'A'
               ORDER BY name ASC`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred while fetching data", error: err });
    }
    res.status(200).json(results);
  });
});


//-------------- Old Api Transaction Data  ---------------//
router.post('/getTransactionData_old', (req, res) => {
  const { from_date, to_date } = req.body;

  if (!from_date || !to_date) {
    return res.status(400).json({ message: "from_date and to_date are required" });
  }

  const transactionSql = `
            SELECT 
              a.doc_no, a.doc_date, a.file_name, a.location, a.consignor, a.consignee, a.sur_no,
              a.category, a.type, a.area, a.sq_mtr1, a.sale_area, a.sq_mtr2, a.cst_no, a.pur_date,
              a.pur_val, a.reg_fee, a.fra_fee, a.remark,
              b.name AS loc_name,
              c.name AS consignor_name,
              d.name AS consignee_name
            FROM st_ptran AS a
            LEFT JOIN st_ploc AS b ON a.location = b.id
            LEFT JOIN st_consignor AS c ON a.consignor = c.id
            LEFT JOIN st_consignee AS d ON a.consignee = d.id
            WHERE DATE(a.doc_date) BETWEEN ? AND ? AND a.status = 'A'
          `;

  db.query(transactionSql, [from_date, to_date], (err, transactions) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return res.status(500).json({ message: "Error fetching transactions" });
    }

    if (transactions.length === 0) {
      return res.status(200).json([]); // No transactions
    }

    const docNos = transactions.map(t => t.doc_no);
    const placeholders = docNos.map(() => '?').join(',');
    const filesSql = `SELECT doc_no, sr_no, doc_type, description, path FROM st_pfiles WHERE doc_no IN (${placeholders})`;

    db.query(filesSql, docNos, (err, files) => {
      if (err) {
        console.error("Error fetching files:", err);
        return res.status(500).json({ message: "Error fetching files" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`; // e.g. http://192.168.179.23:3000

      // Group files by doc_no and prepend baseUrl
      const filesByDoc = {};
      files.forEach(file => {
        const fileWithUrl = {
          ...file,
          path: file.path ? `${baseUrl}/${file.path.replace(/^\/+/, '')}` : null
        };

        if (!filesByDoc[file.doc_no]) filesByDoc[file.doc_no] = [];
        filesByDoc[file.doc_no].push(fileWithUrl);
      });

      // Merge files into transactions
      const combinedData = transactions.map(tran => ({
        ...tran,
        files: filesByDoc[tran.doc_no] || []
      }));

      res.status(200).json(combinedData);
    });
  });
});
router.post('/getEditPTran_old', (req, res) => {
  const { doc_no } = req.body;

  const sql = `SELECT 
                  a.doc_no, a.doc_date, a.file_name, a.location, a.consignor, a.consignee, a.sur_no,
                  a.category, a.type, a.area, a.sq_mtr1, a.sale_area, a.sq_mtr2, a.cst_no, a.pur_date, 
                  a.pur_val, a.reg_fee, a.fra_fee, a.remark,
                  b.name AS loc_name,
                  c.name AS consignor_name,
                  d.name AS consignee_name
               FROM st_ptran AS a
                LEFT JOIN st_ploc AS b ON a.location = b.id
                LEFT JOIN st_consignor AS c ON a.consignor = c.id
                LEFT JOIN st_consignee AS d ON a.consignee = d.id
               WHERE a.doc_no = ? AND a.status = 'A'`;

  db.query(sql, [doc_no], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred while fetching data" });
    }
    res.status(200).json(results);
  });
});
router.post('/new-ptran_old', upload.any(), (req, res) => {
  const { docDate, fileName, locId, consigneeId, consignorId, surveyNo, category, type, area, sqmtr1, salesArea, sqmtr2, cstNo, purDate, purVal, regFees, fraFees, remark } = req.body;

  let rows = [];
  try {
    rows = JSON.parse(req.body.rows);
  } catch (e) {
    return res.status(400).json({ message: "Invalid rows data" });
  }

  const sql1 = `SELECT MAX(doc_no) AS maxDocNo FROM st_ptran`;
  db.query(sql1, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching doc_no" });

    const docNo = (results[0].maxDocNo || 0) + 1;

    const insertPtran = `INSERT INTO st_ptran(doc_no, doc_date, file_name, location, consignor, consignee, sur_no,
      category, type, area, sq_mtr1, sale_area, sq_mtr2, cst_no, pur_date, pur_val, reg_fee, fra_fee, remark, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    const ptranValues = [docNo, docDate, fileName, locId, consignorId, consigneeId, surveyNo, category, type,
      area, sqmtr1, salesArea, sqmtr2, cstNo, purDate, purVal, regFees, fraFees, remark, 'A'];

    db.query(insertPtran, ptranValues, (err) => {

      if (err) {
        console.log(err);

        return res.status(500).json({ message: "Error inserting ptran" })
      }

      const insertPfiles = `INSERT INTO st_pfiles(doc_no, sr_no, doc_type, description, path) VALUES ?`;

      const fileData = rows.map((row, index) => {
        const file = req.files.find(f => f.fieldname === `file_${index}`);
        const filePath = file ? `/uploads/${file.filename}` : "";
        return [
          docNo,
          index + 1,
          row.docName,
          row.docDes,
          filePath
        ];
      });

      if (fileData.length > 0) {
        db.query(insertPfiles, [fileData], (err) => {
          console.log(err);
          if (err) return res.status(500).json({ message: "Error inserting files" });
          res.status(200).json({ message: "Entry successful" });
        });
      } else {
        res.status(200).json({ message: "Entry successful (no files)" });
      }
    });
  });
});
router.put('/editPTransaction_old', (req, res) => {
  const { doc_no, doc_date, file_name, loc_id, consignor_id, consignee_id, sur_no, category, type, area,
    sq_mtr1, sale_area, sq_mtr2, cst_no, pur_date, pur_val, reg_fee, fra_fee, remark } = req.body;

  const sql = `
    UPDATE st_ptran
    SET
      doc_date = ?,
      file_name = ?,
      location = ?,
      consignor = ?,
      consignee = ?,
      sur_no = ?,
      category = ?,
      type = ?,
      area = ?,
      sq_mtr1 = ?,
      sale_area = ?,
      sq_mtr2 = ?,
      cst_no = ?,
      pur_date = ?,
      pur_val = ?,
      reg_fee = ?,
      fra_fee = ?,
      remark = ?
    WHERE doc_no = ? AND status = 'A'
  `;

  const values = [doc_date, file_name, loc_id, consignor_id, consignee_id, sur_no, category, type, area,
    sq_mtr1, sale_area, sq_mtr2, cst_no, pur_date, pur_val, reg_fee, fra_fee, remark, doc_no];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "An error occurred while updating the transaction." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found. No update performed." });
    }

    res.status(200).json({ message: "Transaction updated successfully." });
  });
});
router.put('/deletePTransaction_old', (req, res) => {
  const { doc_no } = req.body;

  if (!doc_no) {
    return res.status(400).json({ message: "Missing required field: Doc No." });
  }

  const sql = `
    UPDATE st_ptran
    SET status = ?
    WHERE doc_no = ?`;

  db.query(sql, ['I', doc_no], (err, result) => {
    if (err) {
      console.error("Database error during delete:", err);
      return res.status(500).json({ message: "An error occurred while deleting the transaction." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found. No deletion performed." });
    }

    res.status(200).json({ message: "Transaction deleted successfully." });
  });
});


//-------------- New Api Transaction Data  ---------------//
router.post('/new-property-tran', upload.any(), (req, res) => {
  try {
    const inputs = JSON.parse(req.body.inputs);
    const surRows = JSON.parse(req.body.surRows);
    const rows = JSON.parse(req.body.rows);
    const files = req.files;

    // 1. Insert into doc_hd
    const docHdSql = `
      INSERT INTO doc_hd 
        (doc_date, file_name, loc_id, consignor, catg, type, cst_no, pur_date, pur_val, reg_fees, fra_fees, remark,status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,'A')`;

    const docHdValues = [
      inputs.docDate,
      inputs.fileName,
      inputs.location,
      inputs.consignor,
      inputs.category,
      inputs.type,
      inputs.cstNo,
      inputs.purDate,
      inputs.purVal,
      inputs.regFees,
      inputs.fraFees,
      inputs.remark
    ];

    db.query(docHdSql, docHdValues, (err, result) => {
      if (err) {
        console.error('Error inserting into doc_hd:', err);
        return res.status(500).json({ message: 'Failed to insert into doc_hd' });
      }

      const docId = result.insertId;

      // 2. Insert into doc_survey
      surRows.forEach((row, index) => {
        const surveySql = `
          INSERT INTO doc_survey 
            (doc_id, doc_date, sr_no, cong_id, sur_no, area, balance, sqmtr,status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?,'A')
        `;
        const surveyValues = [
          docId,
          inputs.docDate,
          index + 1,
          row.consignee,
          row.surveyNo,
          row.area,
          row.sqmtr,
          row.sqmtr
        ];

        db.query(surveySql, surveyValues, (err) => {
          if (err) console.error(`Survey row ${index + 1} insert failed:`, err);
        });
      });

      // 3. Insert into doc_files
      rows.forEach((row, index) => {
        const file = files.find(f => f.fieldname === `file-${index}` || f.originalname === row.docName);

        let docPath = '';
        if (file) {
          // multer already saved the file with correct name in /uploads
          docPath = `/uploads/${file.filename}`;
        }

        const docFileSql = `
          INSERT INTO doc_file 
            (doc_no, date, sr_no, doc_code, doc_desc, doc_path,status)
          VALUES (?, ?, ?, ?, ?, ?,'A')
        `;
        const docFileValues = [
          docId,
          inputs.docDate,
          index + 1,
          row.docName,
          row.docDes,
          docPath
        ];

        db.query(docFileSql, docFileValues, (err) => {
          if (err) console.error(`doc_files row ${index + 1} insert failed:`, err);
        });
      });

      res.status(200).json({ message: 'Transaction saved successfully', docId });
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/getTransactionData1', (req, res) => {
  const { from_date, to_date } = req.body;

  if (!from_date || !to_date) {
    return res.status(400).json({ message: "from_date and to_date are required" });
  }

  const transactionSql = `
                          SELECT doc_id,doc_date,file_name 
                          FROM doc_hd
                          WHERE doc_date BETWEEN ? AND ? AND status = 'A'`;

  db.query(transactionSql, [from_date, to_date], (err, transactions) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return res.status(500).json({ message: "Error fetching transactions" });
    }
    res.status(200).json(transactions);
  });
});

router.get("/getPtranData/:id", (req, res) => {
  const id = req.params.id;
  const Sql = `
    SELECT 
      a.doc_id, a.doc_date, a.file_name, a.consignor, a.catg, a.type, 
      a.cst_no, a.pur_date, a.pur_val, a.reg_fees, a.fra_fees, a.remark,
      b.name AS loc_name, a.loc_id,

      c.sr_no AS survey_sr_no, c.cong_id, c.sur_no, c.area, c.sqmtr,

      d.sr_no AS file_sr_no, d.doc_code, e.name AS doc_name, d.doc_desc, d.doc_path
    FROM doc_hd AS a
    LEFT JOIN st_ploc AS b ON a.loc_id = b.id
    LEFT JOIN doc_survey AS c ON a.doc_id = c.doc_id
    LEFT JOIN doc_file AS d ON a.doc_id = d.doc_no
    LEFT JOIN st_doc AS e ON d.doc_code = e.id
    WHERE a.doc_id = ? AND a.status = 'A'
  `;

  db.query(Sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length === 0) return res.status(404).json({ message: "No record found" });

    const data = results[0];
    const response = {
      doc_id: data.doc_id,
      doc_date: data.doc_date,
      file_name: data.file_name,
      consignor: data.consignor,
      catg: data.catg,
      type: data.type,
      cst_no: data.cst_no,
      pur_date: data.pur_date,
      pur_val: data.pur_val,
      reg_fees: data.reg_fees,
      fra_fees: data.fra_fees,
      remark: data.remark,
      loc_id: data.loc_id,
      loc_name: data.loc_name,
      surveys: [],
      documents: []
    };

    const surveyMap = new Set();
    const docMap = new Set();

    results.forEach(row => {
      // Add unique surveys
      const surveyKey = `${row.survey_sr_no}-${row.sur_no}-${row.area}`;
      if (row.sur_no && !surveyMap.has(surveyKey)) {
        response.surveys.push({
          sr_no: row.survey_sr_no,
          cong_id: row.cong_id,
          sur_no: row.sur_no,
          area: row.area,
          sqmtr: row.sqmtr
        });
        surveyMap.add(surveyKey);
      }

      // Add unique documents
      const docKey = `${row.file_sr_no}-${row.doc_code}-${row.doc_path}`;
      if (row.doc_code && !docMap.has(docKey)) {
        response.documents.push({
          sr_no: row.file_sr_no,
          doc_code: row.doc_code,
          doc_name: row.doc_name,
          doc_desc: row.doc_desc,
          doc_path: row.doc_path
        });
        docMap.add(docKey);
      }
    });

    res.status(200).json(response);
  });
});

router.put("/updatePTran", async (req, res) => {
  const { doc_id, doc_date, file_name, loc_id, consignor, catg, type, cst_no, pur_date, pur_val, reg_fees, fra_fees, remark, survData = [], docData = [] } = req.body;

  try {
    // 1. Update doc_hd
    const hdSql = `
      UPDATE doc_hd SET
        file_name = ?,
        loc_id = ?,
        consignor = ?,
        catg = ?,
        type = ?,
        cst_no = ?,
        pur_date = ?,
        pur_val = ?,
        reg_fees = ?,
        fra_fees = ?,
        remark = ?
      WHERE doc_id = ? AND doc_date = ? AND status = 'A'`;

    await query(hdSql, [file_name, loc_id, consignor, catg, type, cst_no, pur_date, pur_val, reg_fees, fra_fees, remark, doc_id, doc_date]);

    // 2. Update doc_file
    const fileSql = `
                    UPDATE doc_file
                    SET doc_code = ?, doc_desc = ?
                    WHERE doc_no = ? AND date = ? AND status = 'A'`;

    for (const item of docData) {
      await query(fileSql, [item.docName, item.docDes, doc_id, doc_date]);
    }

    // 3. Update doc_survey
    const survSql = `
                    UPDATE doc_survey
                    SET cong_id = ?, sur_no = ?, area = ?, sqmtr = ?
                    WHERE doc_id = ? AND doc_date = ? AND status = 'A'`;

    for (const item of survData) {
      await query(survSql, [item.consignee, item.surveyNo, item.area, item.sqmtr, doc_id, doc_date]);
    }

    res.status(200).json({ message: "Property Details updated successfully!" });

  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Error updating transaction", error: err });
  }
});

router.put('/newDeletePTransaction', (req, res) => {
  const { doc_no } = req.body;

  if (!doc_no) {
    return res.status(400).json({ message: "Missing required field: Doc No." });
  }

  const hdSql = `UPDATE doc_hd SET status = ? WHERE doc_id = ? AND status = 'A'`;
  const fileSql = `UPDATE doc_file SET status = ? WHERE doc_no = ? AND status = 'A'`;
  const survSql = `UPDATE doc_survey SET status = ? WHERE doc_id = ? AND status = 'A'`;

  db.query(hdSql, ['I', doc_no], (err, result1) => {
    if (err) return res.status(500).json({ message: "Error updating doc_hd" });

    db.query(fileSql, ['I', doc_no], (err, result2) => {
      if (err) return res.status(500).json({ message: "Error updating doc_file" });

      db.query(survSql, ['I', doc_no], (err, result3) => {
        if (err) return res.status(500).json({ message: "Error updating doc_survey" });

        res.status(200).json({ message: "Transaction deleted successfully." });
      });
    });
  });
});


//-------------- Sale Transaction API --------------//
router.get('/getSaleModalData', (req, res) => {
  const sql = `SELECT a.doc_id, a.doc_date, a.file_name
               FROM doc_hd AS a`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching data" });
    }
    res.status(200).json(results);
  });

});

router.post("/getSaleProperty", (req, res) => {
  const { doc_id, doc_date } = req.body;

  const sql = `
    SELECT 
      a.doc_id,
      a.doc_date,
      a.consignor,
      a.cst_no,
      a.pur_date,
      a.pur_val,
      a.reg_fees,
      a.fra_fees,
      b.sr_no,
      b.cong_id,
      c.name AS consignee_name,
      b.sur_no,
      b.area,
      b.balance,
      b.sqmtr,
      b.status
    FROM doc_hd AS a
    LEFT JOIN doc_survey AS b ON a.doc_id = b.doc_id AND a.doc_date = b.doc_date
    LEFT JOIN st_consignee AS c ON b.cong_id = c.id
    WHERE a.doc_id = ? AND a.doc_date = ?`;

  db.query(sql, [doc_id, doc_date], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No record found" });
    }

    const { doc_id, doc_date, consignor, cst_no, pur_date, pur_val, reg_fees, fra_fees } = results[0];

    const survey = results
      .filter(row => row.sr_no !== null)
      .map(row => ({
        sr_no: row.sr_no,
        cong_id: row.cong_id,
        con_name: row.consignee_name,
        sur_no: row.sur_no,
        area: row.area,
        balance: row.balance,
        sqmtr: row.sqmtr,
        status: row.status
      }));

    const response = { doc_id, doc_date, consignor, cst_no, pur_date, pur_val, reg_fees, fra_fees, survey };

    res.status(200).json(response);
  });
});

router.post("/newSaleProperty_old", (req, res) => {
  const { doc_id, doc_date, buyer_name, sale_date, sale_value, sale_area, sale_survey, remark } = req.body;

  if (!doc_id || !doc_date || !buyer_name || !sale_date || !sale_value || !sale_area || !sale_survey) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  const balanceQuery = `
                        SELECT balance FROM doc_survey
                        WHERE doc_id = ? AND doc_date = ? AND sur_no = ?
                      `;

  db.query(balanceQuery, [doc_id, doc_date, sale_survey], (balanceErr, balanceResults) => {
    if (balanceErr) {
      console.error("Balance Query Error:", balanceErr);
      return res.status(500).json({ message: "Failed to retrieve balance" });
    }

    if (balanceResults.length === 0) {
      return res.status(404).json({ message: "No property record found for the given survey number." });
    }

    const currentBalance = balanceResults[0].balance;

    if (sale_area > currentBalance) {
      return res.status(400).json({
        message: `Requested area exceeds the available sale area is ${currentBalance}. & sale area is ${sale_area}`
      });
    }

    // Step 2: Insert into saled_prop
    const insertSql = `
      INSERT INTO saled_prop 
      (doc_no, date, sale_date, buyer_name, sale_value, sale_area, sur_no, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [doc_id, doc_date, sale_date, buyer_name, sale_value, sale_area, sale_survey, remark], (insertErr, insertResults) => {
      if (insertErr) {
        console.error("Insert Error:", insertErr);
        return res.status(500).json({ message: "Error inserting sale property" });
      }

      // Step 3: Update balance
      const updateSql = `
          UPDATE doc_survey
          SET balance = balance - ?
          WHERE doc_id = ? AND doc_date = ? AND sur_no = ?
        `;

      db.query(updateSql, [sale_area, doc_id, doc_date, sale_survey], (updateErr, updateResults) => {
        if (updateErr) {
          console.error("Balance Update Error:", updateErr);
          return res.status(500).json({ message: "Sale inserted, but failed to update balance" });
        }

        res.status(201).json({ message: "Sale property entry successfully" });
      }
      );
    }
    );
  });
});

router.post("/newSaleProperty", (req, res) => {
  const { doc_id, doc_date, buyer_name, sale_date, sale_value, sale_area, sale_survey, remark } = req.body;

  if (!doc_id || !doc_date || !buyer_name || !sale_date || !sale_value || !sale_area || !sale_survey) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  const balanceQuery = `
                        SELECT balance FROM doc_survey
                        WHERE doc_id = ? AND doc_date = ? AND sur_no = ?
                      `;

  db.query(balanceQuery, [doc_id, doc_date, sale_survey], (balanceErr, balanceResults) => {
    if (balanceErr) {
      console.error("Balance Query Error:", balanceErr);
      return res.status(500).json({ message: "Failed to retrieve balance" });
    }

    if (balanceResults.length === 0) {
      return res.status(404).json({ message: "No property found. Please check survey number." });
    }

    const currentBalance = balanceResults[0].balance;

    if (parseFloat(sale_area) > parseFloat(currentBalance)) {
      return res.status(400).json({ message: `Requested area (${sale_area}) exceeds the available balance area (${currentBalance})` });
    }

    // Step 2: Insert into saled_prop
    const insertSql = `
                        INSERT INTO saled_prop 
                        (doc_no, date, sale_date, buyer_name, sale_value, sale_area, sur_no, remark,status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                      `;

    db.query(insertSql, [doc_id, doc_date, sale_date, buyer_name, sale_value, sale_area, sale_survey, remark, 'A'], (insertErr, insertResults) => {
      if (insertErr) {
        console.error("Insert Error:", insertErr);
        return res.status(500).json({ message: "Error inserting sale property" });
      }

      // Step 3: Update balance
      const updateSql = `
                          UPDATE doc_survey
                          SET balance = balance - ?
                          WHERE doc_id = ? AND doc_date = ? AND sur_no = ?
                        `;

      db.query(updateSql, [sale_area, doc_id, doc_date, sale_survey], (updateErr, updateResults) => {
        if (updateErr) {
          console.error("Balance Update Error:", updateErr);
          return res.status(500).json({ message: "Sale inserted, but failed to update balance" });
        }
        res.status(201).json({ message: "Sale property entry successfully created" });
      }
      );
    }
    );
  });
});

router.post("/getAllSaledProp", (req, res) => {
  const { from_date, to_date } = req.body;

  const sql = `SELECT a.sale_id,b.doc_id,b.doc_date,b.file_name,a.sale_date,a.buyer_name,a.sale_area,a.sur_no,a.remark,a.sale_value
               FROM saled_prop AS a
               LEFT JOIN doc_hd AS b ON a.doc_no = b.doc_id
               WHERE a.sale_date BETWEEN ? AND ?`;
  db.query(sql, [from_date, to_date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching sale properties" });
    }
    res.json(results);
  });
});

router.put("/updateSaledProp", (req, res) => {
  const { sale_id, date, doc_no, sale_date, buyer_name, sale_value, sale_area, sur_no, remark } = req.body;

  const updateSql = `UPDATE saled_prop SET
                        sale_date = ?, buyer_name = ?, sale_value = ?, sale_area = ?, sur_no = ?, remark = ? 
                     WHERE sale_id = ? AND doc_no = ? AND date = ?`;
  db.query(updateSql, [sale_date, buyer_name, sale_value, sale_area, sur_no, remark, sale_id, doc_no, date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating sale property", err: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "No matching record found to update" });
    }

    res.status(200).json({ message: "Sale property updated successfully" });
  }
  );
});

export default router;
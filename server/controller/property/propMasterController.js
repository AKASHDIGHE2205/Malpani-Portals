// controllers/masterController.js
import db from "../../db.js";

// ----------------- Consignor -----------------
export const getAllConsignor = (req, res) => {
  const sql = `SELECT * FROM st_consignor`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching data", error: err });
    res.status(200).json(results);
  });
};

export const newConsignor = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Consignor name is required." });

  const sql = `INSERT INTO st_consignor (name, status) VALUES (?, ?)`;
  db.query(sql, [name, "A"], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new consignor", error: err });
    res.status(201).json({ message: "New Consignor created successfully!" });
  });
};

export const editConsignor = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields (id, name, status)" });

  const sql = `UPDATE st_consignor SET name = ?, status = ? WHERE id = ?`;
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating consignor", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Consignor not found or no changes made" });
    res.status(200).json({ message: "Consignor updated successfully." });
  });
};

// ----------------- Consignee -----------------
export const getAllConsignee = (req, res) => {
  const sql = `SELECT * FROM st_consignee`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching data", error: err });
    res.status(200).json(results);
  });
};

export const newConsignee = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Consignee name is required." });

  const sql = `INSERT INTO st_consignee (name, status) VALUES (?, ?)`;
  db.query(sql, [name, "A"], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new consignee", error: err });
    res.status(201).json({ message: "New Consignee created successfully!" });
  });
};

export const editConsignee = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields (id, name, status)" });

  const sql = `UPDATE st_consignee SET name = ?, status = ? WHERE id = ?`;
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating consignee", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Consignee not found or no changes made" });
    res.status(200).json({ message: "Consignee updated successfully." });
  });
};

// ----------------- Document -----------------
export const getAllDocument = (req, res) => {
  const sql = `SELECT * FROM st_doc`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching data", error: err });
    res.status(200).json(results);
  });
};

export const newDocument = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Document name is required." });

  const sql = `INSERT INTO st_doc (name, status) VALUES (?, ?)`;
  db.query(sql, [name, "A"], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new document", error: err });
    res.status(201).json({ message: "New Document created successfully!" });
  });
};

export const editDocument = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields (id, name, status)" });

  const sql = `UPDATE st_doc SET name = ?, status = ? WHERE id = ?`;
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating document", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Document not found or no changes made" });
    res.status(200).json({ message: "Document updated successfully." });
  });
};

// ----------------- Location -----------------
export const getAllPLocation = (req, res) => {
  const sql = `SELECT * FROM st_ploc`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching data", error: err });
    res.status(200).json(results);
  });
};

export const newPLocation = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Location name is required." });

  const sql = `INSERT INTO st_ploc (name, status) VALUES (?, ?)`;
  db.query(sql, [name, "A"], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new location", error: err });
    res.status(201).json({ message: "New Location created successfully!" });
  });
};

export const editPLocation = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields (id, name, status)" });

  const sql = `UPDATE st_ploc SET name = ?, status = ? WHERE id = ?`;
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating location", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Location not found or no changes made" });
    res.status(200).json({ message: "Location updated successfully." });
  });
};

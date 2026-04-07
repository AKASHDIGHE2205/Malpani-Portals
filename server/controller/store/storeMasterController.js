import db from '../../db.js';

// ---------------- FIRMS ----------------
export const getAllFirms = (req, res) => {
  const sql = "SELECT * FROM st_firm";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching firms", error: err });
    res.status(200).json(results);
  });
};

export const createFirm = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Firm name is required." });

  const sql = "INSERT INTO st_firm (name, status) VALUES (?, ?)";
  db.query(sql, [name, 'A'], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new firm", error: err });
    res.status(201).json({ message: "New firm created successfully!" });
  });
};

export const updateFirm = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields." });

  const sql = "UPDATE st_firm SET name = ?, status = ? WHERE id = ?";
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating firm", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Firm not found or no changes made" });

    res.status(200).json({ message: "Firm updated successfully." });
  });
};

// ---------------- BRANCHES ----------------
export const getAllBranches = (req, res) => {
  const sql = "SELECT * FROM st_branch";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching branches", error: err });
    res.status(200).json(results);
  });
};

export const createBranch = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Branch name is required." });

  const sql = "INSERT INTO st_branch (name, status) VALUES (?, ?)";
  db.query(sql, [name, 'A'], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new branch", error: err });
    res.status(201).json({ message: "New branch created successfully!" });
  });
};

export const updateBranch = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields." });

  const sql = "UPDATE st_branch SET name = ?, status = ? WHERE id = ?";
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating branch", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Branch not found" });

    res.status(200).json({ message: "Branch updated successfully." });
  });
};

// ---------------- CATEGORIES ----------------
export const getAllCategories = (req, res) => {
  const sql = "SELECT * FROM st_catg";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching categories", error: err });
    res.status(200).json(results);
  });
};

export const createCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required." });

  const sql = "INSERT INTO st_catg (name, status) VALUES (?, ?)";
  db.query(sql, [name, 'A'], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new category", error: err });
    res.status(201).json({ message: "New category created successfully!" });
  });
};

export const updateCategory = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields." });

  const sql = "UPDATE st_catg SET name = ?, status = ? WHERE id = ?";
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating category", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category updated successfully." });
  });
};

// ---------------- LOCATIONS ----------------
export const getAllLocations = (req, res) => {
  const sql = "SELECT * FROM st_location";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching locations", error: err });
    res.status(200).json(results);
  });
};

export const createLocation = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Location name is required." });

  const sql = "INSERT INTO st_location (name, status) VALUES (?, ?)";
  db.query(sql, [name, 'A'], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new location", error: err });
    res.status(201).json({ message: "New location created successfully!" });
  });
};

export const updateLocation = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields." });

  const sql = "UPDATE st_location SET name = ?, status = ? WHERE id = ?";
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating location", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Location not found" });

    res.status(200).json({ message: "Location updated successfully." });
  });
};

// ---------------- SECTIONS ----------------
export const getAllSections = (req, res) => {
  const sql = "SELECT * FROM st_section";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error occurred while fetching sections", error: err });
    res.status(200).json(results);
  });
};

export const createSection = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Section name is required." });

  const sql = "INSERT INTO st_section (name, status) VALUES (?, ?)";
  db.query(sql, [name, 'A'], (err) => {
    if (err) return res.status(500).json({ message: "Error creating a new section", error: err });
    res.status(201).json({ message: "New section created successfully!" });
  });
};

export const updateSection = (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) return res.status(400).json({ message: "Missing required fields." });

  const sql = "UPDATE st_section SET name = ?, status = ? WHERE id = ?";
  db.query(sql, [name, status, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error updating section", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Section not found" });

    res.status(200).json({ message: "Section updated successfully." });
  });
};
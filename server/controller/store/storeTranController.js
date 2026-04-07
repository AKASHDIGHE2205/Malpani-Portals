import db from "../../db.js";

// Get all transaction entries (between dates)
export const getAllTranEntries = (req, res) => {
  const { from_Date, to_Date } = req.body;
  const sql = `SELECT a.doc_code,a.entry_code,a.date,a.year,a.cub_code,a.s_code,a.su_code,a.desc,a.remark,
                      b.name AS type_name, c.name AS firm_name, d.name as loc_name, e.name as sec_name,
                      a.type_code,a.firm_code,a.loc_code,a.sec_code,a.branch_code,f.name As branch_name
               FROM st_tran AS a
               LEFT JOIN st_catg AS b ON a.type_code = b.id
               LEFT JOIN st_firm AS c ON a.firm_code = c.id
               LEFT JOIN st_location AS d ON a.loc_code = d.id
               LEFT JOIN st_section AS e ON a.sec_code = e.id
               LEFT JOIN st_branch As f ON a.branch_code = f.id  
               WHERE a.date BETWEEN ? AND ?
               ORDER BY a.doc_code ASC`;

  db.query(sql, [from_Date, to_Date], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching data", error: err });
    res.status(200).json(results);
  });
};

// Get disposed files
export const getDisposedFiles = (req, res) => {
  const { year, firm_code } = req.body;
  const sql = `SELECT a.doc_code,a.entry_code,a.date,a.year,a.cub_code,a.s_code,a.su_code,a.desc,a.remark,
                      b.name AS type_name,c.name AS firm_name,d.name as loc_name,e.name as sec_name,
                      a.type_code,a.firm_code,a.loc_code,a.sec_code,a.branch_code,f.name As branch_name
               FROM st_tran AS a
               LEFT JOIN st_catg AS b ON a.type_code = b.id
               LEFT JOIN st_firm AS c ON a.firm_code = c.id
               LEFT JOIN st_location AS d ON a.loc_code = d.id
               LEFT JOIN st_section AS e ON a.sec_code = e.id
               LEFT JOIN st_branch As f ON a.branch_code = f.id  
               WHERE a.remark IS NOT NULL AND a.remark != '' 
                     AND firm_code=? AND year LIKE ?
               ORDER BY a.date DESC`;

  db.query(sql, [firm_code, `%${year}%`], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching data", error: err });
    res.status(200).json(results);
  });
};

// Create new transaction entry
export const newTranEntry = (req, res) => {
  const { date, entry_code, type_code, firm_code, branch_code, loc_code, sec_code,
    year, cub_code, s_code, su_code, desc, remark, status } = req.body;

  if (!date || !type_code || !firm_code || !loc_code || !sec_code || !year || !desc || !cub_code || !s_code || !su_code) {
    return res.status(400).json({ message: "Please fill all required fields." });
  }

  const insertEntry = (newEntryCode) => {
    const sql = `INSERT INTO st_tran 
      (\`date\`, entry_code, type_code, firm_code, branch_code, loc_code, sec_code,
       year, cub_code, s_code, su_code, \`desc\`, remark, status) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.query(sql, [
      date,
      newEntryCode,
      type_code,
      firm_code,
      branch_code,
      loc_code,
      sec_code,
      year,
      cub_code,
      s_code,
      su_code,
      desc,
      remark,
      status
    ], (err, results) => {
      if (err) return res.status(500).json({ message: "Error creating entry", error: err.message });
      res.status(201).json({ message: "Entry created successfully", entryId: results.insertId });
    });
  };

  // If entry_code comes from frontend → directly insert
  if (entry_code) {
    return insertEntry(entry_code);
  }

  // Otherwise → get max entry_code and +1
  const getMaxQuery = `SELECT COALESCE(MAX(entry_code), 0) AS maxEntryCode FROM st_tran`;

  db.query(getMaxQuery, [], (err, results) => {
    if (err) return res.status(500).json({ message: "Error generating entry_code", error: err.message });

    const generatedEntryCode = results[0].maxEntryCode + 1; // ✅ Auto Increment by 1
    insertEntry(generatedEntryCode);
  });
};

// Get entry by ID
export const getTranEntryById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT a.doc_code,a.date,a.year,a.cub_code,a.type_code,a.firm_code,a.loc_code,a.sec_code,
                      a.s_code,a.su_code,a.desc,a.remark,b.name AS type_name,c.name AS firm_name,
                      d.name as loc_name,e.name as sec_name
               FROM st_tran AS a
               LEFT JOIN st_catg AS b ON a.type_code = b.id
               LEFT JOIN st_firm AS c ON a.firm_code = c.id
               LEFT JOIN st_location AS d ON a.loc_code = d.id
               LEFT JOIN st_section AS e ON a.sec_code = e.id
               WHERE a.doc_code = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching data", error: err });
    res.status(200).json(results);
  });
};

// Update entry
export const updateTranEntry = (req, res) => {
  const { doc_code, date, type_code, firm_code, branch_code, loc_code, sec_code,
    year, cub_code, s_code, su_code, desc, remark } = req.body;

  const sql = `UPDATE st_tran SET date = ?, type_code = ?, firm_code = ?, branch_code = ?, 
                                  loc_code = ?, sec_code = ?, year = ?, cub_code = ?, 
                                  s_code = ?, su_code = ?, \`desc\` = ?, remark = ?
               WHERE doc_code = ? AND date = ?`;

  db.query(sql, [date, type_code, firm_code, branch_code, loc_code, sec_code,
    year, cub_code, s_code, su_code, desc, remark, doc_code, date], (err, results) => {
      if (err) return res.status(500).json({ message: "Error updating entry", error: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ message: "Entry not found" });
      res.status(200).json({ message: "Entry updated successfully" });
    });
};

// Active filters
export const getActiveFirms = (_, res) => {
  db.query("SELECT * FROM st_firm WHERE status = 'A'", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching firms", error: err });
    res.status(200).json(results);
  });
};

export const getActiveBranches = (_, res) => {
  db.query("SELECT * FROM st_branch WHERE status = 'A'", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching branches", error: err });
    res.status(200).json(results);
  });
};

export const getActiveCategories = (_, res) => {
  db.query("SELECT * FROM st_catg WHERE status = 'A'", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching categories", error: err });
    res.status(200).json(results);
  });
};

export const getActiveLocations = (_, res) => {
  db.query("SELECT * FROM st_location WHERE status = 'A'", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching locations", error: err });
    res.status(200).json(results);
  });
};

export const getActiveSections = (_, res) => {
  db.query("SELECT * FROM st_section WHERE status = 'A'", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching sections", error: err });
    res.status(200).json(results);
  });
};
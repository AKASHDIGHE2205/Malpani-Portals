import db from "../../db.js";

// ✅ Get Entry Status
export const getEntryStatus = (req, res) => {
  const sql = `
    SELECT 
      a.firm_code, 
      b.name AS firm_name, 
      COUNT(*) AS record_count,
      0 AS sort_order
    FROM st_tran AS a
    LEFT JOIN st_firm AS b ON a.firm_code = b.id
    GROUP BY a.firm_code, b.name

    UNION ALL

    SELECT 
      NULL AS firm_code, 
      'Total' AS firm_name, 
      COUNT(*) AS record_count,
      1 AS sort_order
    FROM st_tran

    ORDER BY sort_order, firm_name`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching entry status:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
};

// ✅ Branch-wise Report
export const branchWiseReport = (req, res) => {
  const { branch_code, year } = req.body;

  if (!year) {
    return res.status(400).json({ message: "Please fill all required fields!" });
  }

  let sql = `
    SELECT 
      a.doc_code,
      a.entry_code,
      a.date,
      a.desc,
      b.name AS firm_name,
      c.name AS branch_name,
      a.year,
      a.cub_code,
      a.s_code,
      a.remark,
      a.firm_code,
      a.branch_code
    FROM st_tran AS a
    LEFT JOIN st_firm AS b ON a.firm_code = b.id
    LEFT JOIN st_branch AS c ON a.branch_code = c.id
    WHERE a.year = ?`;

  if (branch_code !== "All") {
    sql += ` AND a.branch_code = ?`;
  }

  db.query(sql, branch_code !== "All" ? [year, branch_code] : [year], (err, results) => {
    if (err) {
      console.error("Error fetching branch-wise report:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
};

// ✅ Firm-wise Report
export const firmWiseReport = (req, res) => {
  const { firm_code, year } = req.body;

  if (!year) {
    return res.status(400).json({ message: "Please provide the year!" });
  }

  let sql = `
    SELECT 
      a.doc_code,
      a.entry_code,
      a.date,
      a.desc,
      b.name AS firm_name,
      c.name AS branch_name,
      a.year,
      a.cub_code,
      a.s_code,
      a.remark,
      a.firm_code,
      a.branch_code
    FROM st_tran AS a
    LEFT JOIN st_firm AS b ON a.firm_code = b.id
    LEFT JOIN st_branch AS c ON a.branch_code = c.id
    WHERE a.year = ?`;

  if (firm_code !== "All") {
    sql += ` AND a.firm_code = ?`;
  }

  db.query(sql, firm_code !== "All" ? [year, firm_code] : [year], (err, results) => {
    if (err) {
      console.error("Error fetching firm-wise report:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
};

// ✅ Year-wise Report
export const yearWiseReport = (req, res) => {
  const { year } = req.body;

  if (!year) {
    return res.status(400).json({ message: "Please fill all required fields!" });
  }

  const sql = `
    SELECT 
      a.doc_code,
      a.entry_code,
      a.date,
      a.desc,
      b.name AS firm_name,
      c.name AS branch_name,
      a.year,
      a.cub_code,
      a.s_code,
      a.remark,
      a.firm_code,
      a.branch_code
    FROM st_tran AS a
    LEFT JOIN st_firm AS b ON a.firm_code = b.id
    LEFT JOIN st_branch AS c ON a.branch_code = c.id
    WHERE a.year = ?`;

  db.query(sql, [year], (err, results) => {
    if (err) {
      console.error("Error fetching year-wise report:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
};

export const branchFirmWiseReport = (req, res) => {
  const { branch_code, firm_code, year } = req.body;

  if (!year) {
    return res.status(400).json({ message: "Please fill all required fields!" });
  }

  let sql = `
    SELECT 
      a.doc_code,
      a.entry_code,
      DATE_FORMAT(a.date, '%Y-%m-%d') AS date,
      a.desc,
      b.name AS firm_name,
      c.name AS branch_name,
      a.year,
      a.cub_code,
      a.s_code,
      a.remark,
      a.firm_code,
      a.branch_code
    FROM st_tran AS a
    LEFT JOIN st_firm AS b ON a.firm_code = b.id
    LEFT JOIN st_branch AS c ON a.branch_code = c.id
    WHERE a.year = ?`;

  let params = [year];

  // ✅ Apply Branch Filter if Selected
  if (branch_code !== "All") {
    sql += ` AND a.branch_code = ?`;
    params.push(branch_code);
  }

  // ✅ Apply Firm Filter if Selected
  if (firm_code !== "All") {
    sql += ` AND a.firm_code = ?`;
    params.push(firm_code);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching Combined Report:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
};

export const getReportData = (req, res) => {
  let sql = `
    SELECT 
      a.doc_code,
      a.entry_code,
      DATE_FORMAT(a.date, '%Y-%m-%d') AS date,
      a.desc,
      b.name AS firm_name,
      c.name AS branch_name,
      a.year,
      a.cub_code,
      a.s_code,
      a.remark,
      a.firm_code,
      a.branch_code
    FROM st_tran AS a
    LEFT JOIN st_firm AS b ON a.firm_code = b.id
    LEFT JOIN st_branch AS c ON a.branch_code = c.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching Combined Report:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
};


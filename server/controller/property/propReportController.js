import db from "../../db.js";

export const propertyRegisterOld = (req, res) => {
  const { from_date, to_date, location, consignee, category, type } = req.body;

  let sql = `
    SELECT 
      a.doc_no, a.doc_date, a.file_name, a.location, a.consignor, a.consignee, 
      a.sur_no, a.area, a.sq_mtr1, a.sale_area, a.sq_mtr2, a.pur_date, 
      a.pur_val, a.reg_fee, a.fra_fee, a.remark,
      b.name AS loc_name,
      c.name AS consignee_name,
      d.name AS consignor_name
    FROM st_ptran AS a
    LEFT JOIN st_ploc AS b ON a.location = b.id
    LEFT JOIN st_consignee AS c ON a.consignee = c.id
    LEFT JOIN st_consignor AS d ON a.consignor = d.id
    WHERE a.doc_date BETWEEN ? AND ? 
      AND a.location = ? 
      AND a.consignee = ? 
      AND a.status = 'A'
  `;

  const params = [from_date, to_date, location, consignee];

  if (category && category !== 'all') {
    sql += ` AND a.category = ?`;
    params.push(category);
  }

  if (type && type !== 'all') {
    sql += ` AND a.type = ?`;
    params.push(type);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: 'An error occurred while fetching the data.' });
    }
    res.status(200).json(results);
  });
};

//2. Location-wise Register
export const locationwiseRegister = (req, res) => {
  const { from_date, to_date, location, category, type } = req.body;

  let sql = `
    SELECT 
      a.doc_no, a.doc_date, a.file_name, a.location, a.consignor, a.consignee, 
      a.sur_no, a.area, a.sq_mtr1, a.sale_area, a.sq_mtr2, a.pur_date, 
      a.pur_val, a.reg_fee, a.fra_fee, a.remark,
      b.name AS loc_name,
      c.name AS consignee_name,
      d.name AS consignor_name
    FROM st_ptran AS a
    LEFT JOIN st_ploc AS b ON a.location = b.id
    LEFT JOIN st_consignee AS c ON a.consignee = c.id
    LEFT JOIN st_consignor AS d ON a.consignor = d.id
    WHERE a.doc_date BETWEEN ? AND ? 
      AND a.location = ? 
      AND a.status = 'A'
  `;

  const params = [from_date, to_date, location];

  if (category && category !== 'all') {
    sql += ` AND a.category = ?`;
    params.push(category);
  }

  if (type && type !== 'all') {
    sql += ` AND a.type = ?`;
    params.push(type);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: 'An error occurred while fetching the data.' });
    }
    res.status(200).json(results);
  });
}

//3. Location & Survey Register
export const locationServeyRegister = (req, res) => {
  const sql = `
    SELECT 
      a.doc_no, a.consignee, 
      b.name AS consignee_name, 
      a.location, 
      c.name AS location_name, 
      a.sur_no, a.area, a.sq_mtr1
    FROM st_ptran AS a
    LEFT JOIN st_consignee AS b ON a.consignee = b.id
    LEFT JOIN st_ploc AS c ON a.location = c.id
    WHERE a.status = 'A'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: 'An error occurred while fetching the data.' });
    }
    res.status(200).json(results);
  });
}

export const propertyRegister = (req, res) => {
  const { from_date, to_date, location, consignee } = req.body;

  let sql = `
    SELECT 
        a.doc_id,
        a.doc_date,
        a.consignor,
        a.type,
        b.sur_no,
        d.name AS loc_name,
        b.sr_no,
        b.area,
        a.fra_fees,
        b.balance,    
        COALESCE(SUM(c.sale_area), 0) AS total_sold_area,
        b.sqmtr AS total_area,
        a.remark
    FROM doc_hd AS a
    LEFT JOIN doc_survey AS b 
        ON a.doc_id = b.doc_id
    LEFT JOIN saled_prop AS c 
        ON a.doc_id = c.doc_no 
       AND b.sur_no = c.sur_no
    LEFT JOIN st_ploc as d ON a.loc_id = d.id
    WHERE a.pur_date BETWEEN ? AND ?
  `;
  const params = [from_date, to_date];

  if (location !== "All") {
    sql += " AND a.loc_id = ? ";
    params.push(location);
  }

  if (consignee !== "All") {
    sql += " AND b.cong_id = ? ";
    params.push(consignee);
  }

  sql += `
    GROUP BY 
        a.doc_id, a.doc_date, a.consignor, a.type, 
        b.sur_no, b.sr_no, b.area, b.balance, 
        a.fra_fees, a.remark, b.sqmtr
    ORDER BY a.doc_id, b.sr_no
  `;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: "An error occurred while fetching the data." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No records found." });
    }

    res.status(200).json(results);
  });
}
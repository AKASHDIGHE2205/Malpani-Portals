import db from "../../db.js"

//Api to get All Dept's for Entry modal view
export const getDepts = (req, res) => {
  const sql = `SELECT dept_id, dept_name FROM dept WHERE status='A'`;

  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      // Log and respond with error status if the query fails
      console.error("Error retrieving departments:", err);
      return res.status(500).json({ message: "Failed to retrieve departments", error: err });
    }

    // Check if results are empty
    if (results.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    // Respond with the retrieved results
    return res.status(200).json(results);
  });
}

//Api to get All post Types for Entry modal view
export const getPTypes = (req, res) => {
  const sql = `SELECT post_id, post_name FROM post_type WHERE status='A'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving departments:", err);
      return res.status(500).json({ message: "Failed to retrieve departments", error: err });
    }
    return res.status(200).json(results);
  });
}

//Api to get All Firms For Entry Modal view
export const getFirms = (req, res) => {
  const sql = `SELECT firm_id, firm_name FROM firms WHERE status='A'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving firms:", err);
      return res.status(500).json({ message: "Failed to retrieve firms", error: err });
    }
    return res.status(200).json(results);
  });
}


//Api to create Inward post Entry
export const newEntry = (req, res) => {
  const { entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, flag, status, c_by, loc_id } = req.body;

  if (!entry_date || !post_type || !dept_id || !firm_id || !loc_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const currentDateTime = new Date();

  const getMaxEntryIdSql = `
    SELECT MAX(entry_id) AS max_entry_id
    FROM post_entry
    WHERE entry_date = ? AND flag = 'I' AND status = 'A' AND loc_id = ?`;

  db.query(getMaxEntryIdSql, [entry_date, loc_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching max entry_id", error: err });
    }

    const maxEntryId = results[0]?.max_entry_id || 0;
    const newEntryId = maxEntryId + 1;

    const insertSql = `
      INSERT INTO post_entry 
      (entry_id, entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, flag, status, loc_id  , c_by, c_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertSql, [newEntryId, entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, flag, status, loc_id, c_by, currentDateTime], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong", error: err });
      }
      return res.status(201).json({ message: `Post Entry Created with Entry ID: ${newEntryId}` });
    });
  });
}

//API tO VIEW ALL INWARD ENTRY
export const getAllInEntry = (req, res) => {
  const { entry_date, loc_id } = req.body;

  const sql = `
    SELECT 
      a.entry_id,
      a.entry_date, 
      e.post_name,
      b.dept_name,
      c.firm_name,
      a.party_name,
      a.city_name,
      a.remark,
      a.receipt_no,
      a.qty,
      a.flag
    FROM 
      post_entry AS a
    LEFT JOIN 
      dept AS b ON a.dept_id = b.dept_id
    LEFT JOIN 
      firms AS c ON a.firm_id = c.firm_id
    LEFT JOIN 
      post_type AS e ON a.post_type = e.post_id
    WHERE
      a.flag = 'I' AND
      a.entry_date = ? AND
      a.status ='A' AND
      a.loc_id = ?
    ORDER BY
      a.entry_id ASC`;

  db.query(sql, [entry_date, loc_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
}

//Api to update Inward Entry
export const updateInEntry = (req, res) => {
  const { entry_date, post_type, dept_id, firm_id, party_name, city_name, remark, receipt_no, qty, entry_id, flag, loc_id } = req.body;

  if (!entry_id) {
    return res.status(400).json({ message: "Missing required field: entry_id" });
  }

  const fields = [];
  const values = [];

  if (entry_date && entry_date !== '') {
    fields.push("entry_date = ?");
    values.push(entry_date);
  }
  if (post_type && post_type !== '') {
    fields.push("post_type = ?");
    values.push(post_type);
  }
  if (dept_id && dept_id !== '' && dept_id !== '0') {
    fields.push("dept_id = ?");
    values.push(dept_id);
  }
  if (firm_id && firm_id !== '' && firm_id !== '0') {
    fields.push("firm_id = ?");
    values.push(firm_id);
  }
  if (party_name && party_name !== '') {
    fields.push("party_name = ?");
    values.push(party_name);
  }
  if (city_name && city_name !== '') {
    fields.push("city_name = ?");
    values.push(city_name);
  }
  if (remark && remark !== '') {
    fields.push("remark = ?");
    values.push(remark);
  }
  if (receipt_no && receipt_no !== '') {
    fields.push("receipt_no = ?");
    values.push(receipt_no);
  }
  if (qty && qty !== '' && qty !== '0') {
    fields.push("qty = ?");
    values.push(qty);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update", details: err });
  }

  const sql = `UPDATE post_entry SET ${fields.join(", ")} WHERE entry_id = ? AND entry_date = ? AND flag = ? AND loc_id = ?`;
  values.push(entry_id, entry_date, flag, loc_id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error updating entry:", err);
      return res.status(500).json({ message: "Error updating entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found", details: err });
    }
    return res.status(200).json({ message: "Entry updated successfully", details: results });
  });
}

//Api to delete InEntry as well OutEntry
export const delInOutEntry = (req, res) => {
  const { entry_date, entry_id, flag, status, loc_id } = req.body;

  if (!entry_id) {
    return res.status(400).json({ message: "Missing required field: entry_id" });
  }

  const sql = `UPDATE post_entry SET status=? WHERE entry_id = ? AND flag = ? AND entry_date=? AND loc_id = ?`;

  db.query(sql, [status, entry_id, flag, entry_date, loc_id], (err, results) => {
    if (err) {
      console.error("Error deleting entry:", err);
      return res.status(500).json({ message: "Error deleting entry", details: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    return res.status(200).json({ message: `EntryNo ${entry_id} deleted successfully`, details: results });
  });
}

//API TO VIEW ALL OUTWARD ENTRY
export const getAllOutEntry = (req, res) => {
  const { entry_date, loc_id } = req.body;

  const sql = `SELECT 
                  a.entry_id,
                  a.entry_date,
                  e.post_name,
                  a.party_name,
                  b.dept_name,
                  c.firm_name,
                  a.city_name,
                  a.remark,
                  a.receipt_no,
                  a.qty,
                  a.flag,
                  a.rec_date,
                  a.ret
                                 FROM 
                  post_entry AS a
               LEFT JOIN 
                  dept AS b ON a.dept_id = b.dept_id
               LEFT JOIN 
                  firms AS c ON a.firm_id = c.firm_id
               LEFT JOIN 
                  post_type AS e ON a.post_type = e.post_id
               WHERE a.flag = 'O' AND
                  a.entry_date = ? AND
                  a.status='A' AND
                  a.loc_id = ?
               ORDER BY 
                   a.entry_id ASC`;

  db.query(sql, [entry_date, loc_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
}

//Api to create Outward post Entry
export const newOutEntry = (req, res) => {
  const { entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, flag, charges, fr_machine, party_name, status, loc_id, c_by } = req.body;

  const currentDateTime = new Date();

  const getMaxEntryIdSql = `
    SELECT COALESCE(MAX(entry_id), 0) AS max_entry_id
    FROM post_entry
    WHERE entry_date = ? AND flag='O' AND status='A' AND loc_id =? `;

  db.query(getMaxEntryIdSql, [entry_date, loc_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching max entry_id", err: err });
    }

    const maxEntryId = results[0].max_entry_id;
    const newEntryId = maxEntryId + 1;

    const insertSql = `
      INSERT INTO post_entry 
      (entry_id, entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, flag, charges, fr_machine, party_name,status,loc_id,c_by,c_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertSql, [newEntryId, entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, flag, charges, fr_machine, party_name, status, loc_id, c_by, currentDateTime], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Something went wrong", err: err });
      }
      return res.status(201).json({
        message: `Post Entry Created!: ${newEntryId}`
      });
    });
  });
}

//Api to update the Outward Entry
export const updateOutEntry = (req, res) => {
  const { entry_date, post_type, dept_id, firm_id, city_name, remark, receipt_no, qty, charges, fr_machine, party_name, entry_id, flag,
    loc_id, rec_status, rec_date } = req.body;
  // console.log(req.body);
  if (!entry_id) {
    return res.status(400).json({ message: "Missing required field: entry_id" });
  }

  const fields = [];
  const values = [];

  if (entry_date && entry_date !== '') {
    fields.push("entry_date = ?");
    values.push(entry_date);
  }
  if (post_type && post_type !== '') {
    fields.push("post_type = ?");
    values.push(post_type);
  }
  if (dept_id && dept_id !== '' && dept_id !== '0') {
    fields.push("dept_id = ?");
    values.push(dept_id);
  }
  if (firm_id && firm_id !== '' && firm_id !== '0') {
    fields.push("firm_id = ?");
    values.push(firm_id);
  }
  if (party_name && party_name !== '') {
    fields.push("party_name = ?");
    values.push(party_name);
  }
  if (city_name && city_name !== '') {
    fields.push("city_name = ?");
    values.push(city_name);
  }
  if (remark && remark !== '') {
    fields.push("remark = ?");
    values.push(remark);
  }
  if (receipt_no && receipt_no !== '') {
    fields.push("receipt_no = ?");
    values.push(receipt_no);
  }
  if (qty && qty !== '' && qty !== '0') {
    fields.push("qty = ?");
    values.push(qty);
  }
  if (charges && charges !== '' && charges !== 0) {
    fields.push("charges = ?");
    values.push(charges);
  }
  if (fr_machine && fr_machine !== '' && fr_machine !== 0) {
    fields.push("fr_machine = ?");
    values.push(fr_machine);
  }
  if (rec_status && rec_status !== '' && rec_status !== 0) {
    fields.push("ret = ?");
    values.push(rec_status);
  }
  if (rec_date && rec_date !== '' && rec_date !== 0) {
    fields.push("rec_date = ?");
    values.push(rec_date);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const sql = `UPDATE post_entry SET ${fields.join(", ")} WHERE entry_id = ? AND entry_date = ? AND flag = ? AND loc_id = ?`;
  values.push(entry_id, entry_date, flag, loc_id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error updating entry:", err);
      return res.status(500).json({ message: "Error updating entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.status(200).json({ message: "Entry update successful", details: results });
  });
}

//Api to create new stamp purchase Entry
export const newStampEntry = (req, res) => {
  const { pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark } = req.body;

  const sql = `
    INSERT INTO stamp_pur 
    (pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(201).json({ message: "Stamp entry created successfully!" });
  });
}

//Api To View all Stam Entries
export const getAllStampEntry = (req, res) => {
  const sql = `SELECT a.pur_date,a.stamp_id,b.firm_name,a.rec_no,a.pay_date,a.stamp,a.fr_machine,a.remark
               FROM stamp_pur AS a
               JOIN firms AS b ON a.firm_name = b.firm_id`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
}

//Api to update the stamp entry
export const updateStampEntry = (req, res) => {
  const { pur_date, firm_name, rec_no, pay_date, stamp, fr_machine, remark, stamp_id } = req.body;

  if (!stamp_id) {
    return res.status(400).json({ message: "Missing required field: stamp_id" });
  }

  const fields = [];
  const values = [];

  if (pur_date && pur_date !== '') {
    fields.push("pur_date = ?");
    values.push(pur_date);
  }
  if (firm_name && firm_name !== '') {
    fields.push("firm_name = ?");
    values.push(firm_name);
  }
  if (rec_no && rec_no !== '' && rec_no !== '0') {
    fields.push("rec_no = ?");
    values.push(rec_no);
  }
  if (pay_date && pay_date !== '') {
    fields.push("pay_date = ?");
    values.push(pay_date);
  }
  if (stamp && stamp !== '' && stamp !== 0) {
    fields.push("stamp = ?");
    values.push(stamp);
  }
  if (fr_machine && fr_machine !== '' && fr_machine !== 0) {
    fields.push("fr_machine = ?");
    values.push(fr_machine);
  }
  if (remark && remark !== '') {
    fields.push("remark = ?");
    values.push(remark);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const sql = `UPDATE stamp_pur SET ${fields.join(", ")} WHERE stamp_id = ?`;
  values.push(stamp_id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error updating stamp entry:", err);
      return res.status(500).json({ message: "Error updating stamp entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Stamp entry not found" });
    }
    return res.status(200).json({ message: "Stamp Entry Update Successful", details: results });
  });
}

//Api to delete stamp Entry
export const delStampEntry = (req, res) => {
  const { id: stamp_id } = req.params;

  if (!stamp_id) {
    return res.status(400).json({ message: "Missing required field: stamp_id" });
  }

  const sql = `DELETE FROM stamp_pur WHERE stamp_id =?`;

  db.query(sql, [stamp_id], (err, results) => {
    if (err) {

      return res.status(500).json({ message: "Error to delete Stamp Entry", details: err })
    }
    return res.status(200).json({ message: `Stamp EntryNo ${stamp_id} delete Successsfull`, details: results });
  });
}

//Api To create new voucher Entry
export const newVoucherEntry = (req, res) => {
  const { v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark } = req.body;

  const sql = `
    INSERT INTO voucher_entry 
    (v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(201).json({ message: "Voucher entry created successfully!" });
  });

}

//Api to View All Vocuher entry
export const getAllVoucherEntry = (req, res) => {

  const sql = `
          SELECT a.v_no,a.v_date,a.receipt_no,a.paid_date,a.stamp,a.fr_machine,a.remark,a.firm_name as firm_id,b.firm_name
          FROM voucher_entry AS a
          JOIN firms AS b ON a.firm_name=b.firm_id`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
}

//Api to update the voucher entry
export const updateVEntry = (req, res) => {
  const { v_date, receipt_no, paid_date, firm_name, stamp, fr_machine, remark, v_no } = req.body;

  if (!v_no) {
    return res.status(400).json({ message: "Missing required field: v_no" });
  }

  const fields = [];
  const values = [];

  if (v_date && v_date !== '') {
    fields.push("v_date = ?");
    values.push(v_date);
  }
  if (receipt_no && receipt_no !== '' && receipt_no !== '0') {
    fields.push("receipt_no = ?");
    values.push(receipt_no);
  }
  if (paid_date && paid_date !== '') {
    fields.push("paid_date = ?");
    values.push(paid_date);
  }
  if (firm_name && firm_name !== '' && firm_name !== '0') {
    fields.push("firm_name = ?");
    values.push(firm_name);
  }
  if (stamp && stamp !== '0') {
    fields.push("stamp = ?");
    values.push(stamp);
  }
  if (fr_machine && fr_machine !== '') {
    fields.push("fr_machine = ?");
    values.push(fr_machine);
  }
  if (remark && remark !== '') {
    fields.push("remark = ?");
    values.push(remark);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const sql = `UPDATE voucher_entry SET ${fields.join(", ")} WHERE v_no = ?`;
  values.push(v_no);

  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error updating entry", details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.status(200).json({ message: "Entry updated successfully!", details: results });
  });
}

//Api to Delete Voucher Entry
export const delVEntry = (req, res) => {
  const { id: v_no } = req.params;

  if (!v_no) {
    return res.status(400).json({ message: "Missing required field: voucherNo" })
  }
  const sql = `DELETE FROM voucher_entry WHERE v_no =?`;

  db.query(sql, [v_no], (err, results) => {
    if (err) {

      return res.status(500).json({ message: "Error To  Delete Entry", details: err });
    }
    return res.status(200).json({ message: `Voucher EntryNo ${v_no} Delete Successfull`, details: results });
  });
}

//Api to View all OUtward details entry
export const getAllOutwardDetails = (req, res) => {
  const { from_date, to_date, firm_id, loc_id } = req.body;

  if (!from_date || !to_date) {
    return res.status(400).json({ message: "Missing required query parameters: from_date and to_date" });
  }

  let sql = `
    SELECT 
        a.entry_id,
        a.entry_date,
        e.post_name AS post_type,
        a.post_type AS post_id,
        c.firm_name,
        b.dept_name,
        a.party_name,
        a.city_name,
        a.remark,
        a.qty,
        a.fr_machine,
        a.charges,

        a.rec_date,
        a.ret ,
        a.flag,
        a.receipt_no
    FROM 
     post_entry AS a 
     LEFT JOIN dept AS b ON a.dept_id = b.dept_id 
     LEFT JOIN firms AS c ON a.firm_id = c.firm_id 
     LEFT JOIN post_type AS e ON a.post_type = e.post_id 
    WHERE 
      a.entry_date BETWEEN ? AND ?  
      AND a.status='A' 
      AND a.flag='O' 
      AND a.loc_id= ?
      `;

  const params = [from_date, to_date, loc_id];

  if (firm_id !== '0') {
    sql += ` AND a.firm_id = ? `;
    params.push(firm_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error retrieving outward details:", err);
      return res.status(500).json({ message: "Something went wrong", details: err });
    }
    return res.status(200).json(results);
  });
}

//Api to update outward Details entry
// router.put("/updateOutwardDetails = (req,res) => {
//   const { data, loc_id } = req.body;

//   if (!data || !Array.isArray(data) || data.length === 0) {
//     return res.status(400).json({ message: "Invalid data provided" });
//   }

//   const updates = data.map(item => ({
//     entry_id: item.entry_id,
//     charges: item.charges,
//     // rec_no: item.rec_no,
//     post_type: item.post_id,
//     entry_date: item.entry_date,
//     flag: item.flag,
//     remark: item.remark
//   }));

//   let errors = [];
//   let successfulUpdates = 0;

//   updates.forEach((update, index) => {
//     const sql = `UPDATE post_entry SET post_type = ?, charges = ?, remark = ? WHERE entry_id = ? AND entry_date = ? AND flag = ? AND loc_id = ?`;


//     db.query(sql, [update.post_type, update.charges,  update.remark, update.entry_id, update.entry_date, update.flag,
//       loc_id], (err, results) => {
//         if (err) {
//           errors.push({ update, err });
//           console.error(`Error executing query for ${JSON.stringify(update)}: ${err}`);
//         } else if (results.affectedRows > 0) {
//           successfulUpdates++;
//         } else {
//           errors.push({ update, err: "No rows updated" });
//           console.warn(`No rows updated for ${JSON.stringify(update)}`);
//         }

//         // Check if all updates are done
//         if (index === updates.length - 1) {
//           if (errors.length > 0) {
//             return res.status(500).json({ message: "Error updating entries", details: errors });
//           } else {
//             return res.status(200).json({ message: "Entries updated successfully", successfulUpdates });
//           }
//         }
//       });
//   });
// });

export const updateOutwardDetails = (req, res) => {
  const { data, loc_id } = req.body;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: "Invalid data provided" });
  }

  const updates = data.map(item => ({
    entry_id: item.entry_id,
    charges: item.charges,
    rec_no: item.rec_no,
    post_type: item.post_id,
    entry_date: item.entry_date,
    flag: item.flag,
    remark: item.remark
  }));
  let errors = [];
  let successfulUpdates = 0;

  updates.forEach((update, index) => {
    const sql = `UPDATE post_entry SET post_type = ?, charges = ?, receipt_no=? ,remark = ? WHERE entry_id = ? AND entry_date = ? AND flag = ? AND loc_id = ?`;


    db.query(sql, [update.post_type, update.charges, update.rec_no, update.remark, update.entry_id, update.entry_date, update.flag,
      loc_id], (err, results) => {
        if (err) {
          errors.push({ update, err });
          console.error(`Error executing query for ${JSON.stringify(update)}: ${err}`);
        } else if (results.affectedRows > 0) {
          successfulUpdates++;
        } else {
          errors.push({ update, err: "No rows updated" });
          console.warn(`No rows updated for ${JSON.stringify(update)}`);
        }

        // Check if all updates are done
        if (index === updates.length - 1) {
          if (errors.length > 0) {
            return res.status(500).json({ message: "Error updating entries", details: errors });
          } else {
            return res.status(200).json({ message: "Entries updated successfully", successfulUpdates });
          }
        }
      });
  });
}

//Api to view all Type/Department/Firm
export const viewGroup = (req, res) => {
  const { Group } = req.body;

  if (!Group) {
    return res.status(400).json({ message: "Group parameter is required" });
  }

  let sql;
  switch (Group) {
    case 'D':
      sql = `SELECT dept_id AS id, dept_name AS name FROM dept WHERE status='A'`;
      break;
    case 'F':
      sql = `SELECT firm_id AS id, firm_name AS name FROM firms WHERE status='A'`;
      break;
    case 'T':
      sql = `SELECT post_id AS id, post_name AS name  FROM post_type WHERE status='A'`;
      break;
    default:
      return res.status(400).json({ message: "Invalid Group parameter" });
  }

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving data", details: err });
    }
    return res.status(200).json(results);
  });
}

//Api to create New Type/Department/Firm
export const newGroup = (req, res) => {
  const { Group, name, status } = req.body;

  if (!Group || !name) {
    return res.status(400).json({ message: "Group and name parameters are required" });
  }

  let sql;
  switch (Group) {

    case 'D':
      sql = `INSERT INTO dept(dept_name,status) VALUES(?,?)`;
      break;
    case 'F':
      sql = `INSERT INTO firms(firm_name,status) VALUES(?,?)`;
      break;
    case 'T':
      sql = `INSERT INTO post_type(post_name,status) VALUES(?,?)`;
      break;
    default:
      return res.status(400).json({ message: "Invalid Group parameter" });
  }
  db.query(sql, [name, status], (err, results) => {
    if (err) {
      console.error("Error inserting group:", err);
      return res.status(500).json({ message: "Error inserting group", details: err });
    }
    return res.status(200).json({ message: "Group created successfully!", details: results });
  });
}

//Api to Edit Type/Department/Firm
export const editGroup = (req, res) => {
  const { Group, id, name } = req.body;

  if (!Group || !id || !name) {
    return res.status(400).json({ message: "Group, id, and name parameters are required" });
  }

  let sql;
  switch (Group) {
    case 'D':
      sql = `UPDATE dept SET dept_name=? WHERE dept_id=?`;
      break;
    case 'F':
      sql = `UPDATE firms SET firm_name=? WHERE firm_id=?`;
      break;
    case 'T':
      sql = `UPDATE post_type SET post_name=? WHERE post_id=?`;
      break;
    default:
      return res.status(400).json({ message: "Invalid Group parameter" });
  }

  db.query(sql, [name, id], (err, results) => {
    if (err) {
      console.error("Error updating group:", err);
      return res.status(500).json({ message: "Error updating group", details: err });
    }
    return res.status(200).json({ message: "Group updated successfully!", details: results });
  });
}

export const delGroup = (req, res) => {
  const { Group, id, status } = req.body;

  if (!Group || !id || !status) {
    return res.status(400).json({ message: "Group, id, and name parameters are required" });
  }

  let sql;
  switch (Group) {
    case 'D':
      sql = `UPDATE dept SET status=? WHERE dept_id=?`;
      break;
    case 'F':
      sql = `UPDATE firms SET status=? WHERE firm_id=?`;
      break;
    case 'T':
      sql = `UPDATE post_type SET status=? WHERE post_id=?`;
      break;
    default:
      return res.status(400).json({ message: "Invalid Group parameter" });
  }

  db.query(sql, [status, id], (err, results) => {
    if (err) {
      console.error("Error updating group:", err);
      return res.status(500).json({ message: "Error Deleting group", details: err });
    }
    return res.status(200).json({ message: "Group deleted successfully!", details: results });
  });
}

//Api to get Edit Form Data
export const getEditFormData = (req, res) => {
  const { entry_id, entry_date, flag, loc_id } = req.body;

  if (!entry_id || !entry_date || !flag || !loc_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
               SELECT a.entry_id,a.entry_date,a.post_type,b.post_name,a.firm_id,c.firm_name,a.dept_id,d.dept_name,a.city_name,
                      a.remark,a.charges,a.party_name,a.fr_machine,a.rec_date,a.ret,a.receipt_no,a.qty
               FROM post_entry AS a
               LEFT JOIN post_type AS b on a.post_type = b.post_id
               LEFT JOIN firms as c ON a.firm_id = c.firm_id
               LEFT JOIN dept as d on a.dept_id = d.dept_id
               WHERE entry_id = ? AND entry_date = ? AND flag = ? AND loc_id = ? AND a.status = 'A'`;
  db.query(sql, [entry_id, entry_date, flag, loc_id], (err, results) => {
    if (err) {
      console.error("Error retrieving entry data:", err);
      return res.status(500).json({ message: "Error retrieving entry data", details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.status(200).json(results[0]);
  });
}
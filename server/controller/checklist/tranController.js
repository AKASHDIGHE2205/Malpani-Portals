import db from '../../db.js';

export const storeTransaction = (req, res) => {
  const { status = [], description = [], u_id = [], q_id = [] } = req.body;

  const statuses = Array.isArray(status) ? status : [status];
  const descriptions = Array.isArray(description) ? description : [description];
  const u_ids = Array.isArray(u_id) ? u_id : [u_id];
  const q_ids = Array.isArray(q_id) ? q_id : [q_id];
  const files = req.files;

  if (!statuses.length || !descriptions.length || !u_ids.length || !q_ids.length) {
    return res.status(400).json({ message: "Please fill all required fields." });
  }

  const currentDate = new Date();
  const formattedDateTime = currentDate.toISOString().replace("T", " ").slice(0, 19);
  const formattedDate = currentDate.toISOString().slice(0, 10);

  const maxLength = Math.max(u_ids.length, q_ids.length, descriptions.length, statuses.length || 0);
  const records = [];
  let fileIndex = 0;

  for (let i = 0; i < maxLength; i++) {
    const currentFlag = statuses[i] || null;
    const currentImage = currentFlag === "Completed" && fileIndex < files.length
      ? files[fileIndex++].path.replace(/\\/g, '/')
      : null;

    records.push([
      formattedDateTime,
      u_ids[i] || null,
      q_ids[i] || null,
      currentFlag,
      descriptions[i] || null,
      currentImage
    ]);
  }

  let index = 0;

  function deleteNext() {
    if (index < records.length) {
      const [_, uid, qid] = records[index];
      if (qid) {
        const sql = `DELETE FROM checklist_tran WHERE DATE(date) = ? AND u_id = ? AND q_id = ?`;
        db.query(sql, [formattedDate, uid, qid], (err) => {
          if (err) return res.status(500).json({ message: "Error during delete operation" });
          index++;
          deleteNext();
        });
      } else {
        index++;
        deleteNext();
      }
    } else {
      insertRecords();
    }
  }

  function insertRecords() {
    const sql = `INSERT INTO checklist_tran (date, u_id, q_id, q_flag, description, image) VALUES ?`;
    db.query(sql, [records], (err) => {
      if (err) return res.status(500).json({ message: "Error while processing transaction" });
      res.status(200).json({ message: "Your checklist has been added successfully.!" });
    });
  }

  deleteNext();
};

export const getTransactions = (req, res) => {
  const { loc_id, date } = req.body;
  if (!loc_id || !date) return res.status(400).json({ message: "shopee_location ID and date are required." });

  db.query(`SELECT id FROM app_users WHERE loc_id = ? AND user_type='saragam'`, [loc_id], (err, userResults) => {
    if (err) return res.status(500).json({ message: "Error while fetching user ID." });
    if (!userResults.length) return res.status(404).json({ message: "User not found." });

    const userID = userResults[0].id;

    const sql = `
      SELECT CONCAT(b.first_name, " ", b.last_name) AS user_name, a.date, a.u_id, a.q_id, a.q_flag,
             a.description, c.question, d.name AS location_name, a.image
      FROM checklist_tran AS a
      LEFT JOIN app_users AS b ON a.u_id = b.id
      LEFT JOIN questions AS c ON a.q_id = c.id
      LEFT JOIN shopee_location AS d ON b.loc_id = d.id
      WHERE DATE(a.date) = ? AND a.u_id = ?
    `;

    db.query(sql, [date, userID], (err, results) => {
      if (err) return res.status(500).json({ message: "Error while fetching Checklist.", err });
      if (!results.length) return res.status(404).json({ message: `No checklist available for ${date}` });

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const transactions = results.map(item => ({
        ...item,
        image: item.image ? `${baseUrl}/${item.image}` : null,
      }));
      res.status(200).json(transactions);
    });
  });
};

export const getCompletedQuestions = (req, res) => {
  const { u_id } = req.params;
  const date = new Date().toISOString().slice(0, 10);

  const sql = `SELECT q_id, q_flag FROM checklist_tran WHERE DATE(date) = ? AND u_id = ?`;
  db.query(sql, [date, u_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching completed questions." });
    res.status(200).json(results);
  });
};

export const getQuestions = (req, res) => {
  const { week, u_role } = req.body;
  // console.log(u_role, week);

  const role = `%${u_role}%`;
  if (!week || !u_role) return res.status(400).json({ message: "Week and role are required." });

  const sql = `
    SELECT * FROM questions
    WHERE status = 'A' AND week = ? AND u_role LIKE ?
    ORDER BY seq_id ASC
  `;

  db.query(sql, [week, role], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching questions" });
    res.status(200).json(results);
  });
};

export const approveOrReject = (req, res) => {
  const { date, u_id, q_id } = req.body;
  const sql = `UPDATE checklist_tran SET status = ? WHERE date = ? AND u_id = ? AND q_id = ?`;
  db.query(sql, [date, u_id, q_id], (err) => {
    if (err) return res.status(500).json({ message: "Error while updating checklist" });
    res.status(200).json({ message: "Your Feedback sent!" });
  });
};

export const storeAdminTransaction = (req, res) => {
  const { u_id, Answers, loc_id } = req.body;
  if (!u_id || !Answers || !loc_id) return res.status(400).json({ message: "User ID, answers, and shopee_location ID are required." });

  const now = new Date();
  const results = [];

  for (let qid in Answers) {
    const amount = Answers[qid]?.amount || null;
    results.push([now, u_id, qid, amount, loc_id]);
  }

  if (!results.length) return res.status(400).json({ message: "No valid data to insert" });

  const sql = `INSERT INTO checklist_tran (date, u_id, q_id, description, loc_id) VALUES ?`;
  db.query(sql, [results], (err, result) => {
    if (err) return res.status(500).json({ message: "Error while updating checklist" });
    res.status(200).json({ message: "Your checklist has been added successfully!", results: result });
  });
};

export const getAdminTransaction = (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  const sql = `SELECT date, u_id, q_id, description, loc_id FROM checklist_tran WHERE DATE(date) = ? AND u_id = ?`;
  db.query(sql, [date, 4], (err, result) => {
    if (err) return res.status(500).json({ message: "Error while fetching admin transaction" });
    res.status(200).json(result);
  });
};
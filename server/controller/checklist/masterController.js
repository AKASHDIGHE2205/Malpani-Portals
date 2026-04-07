import db from '../../db.js';

// GET ALL LOCATIONS
export const getLocations = (req, res) => {
  const sql = `SELECT * FROM shopee_location WHERE status='A'`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching locations" });
    }
    res.json(results);
  });
};

// GET ALL USERS FOR MASTER
export const getUsers = (req, res) => {
  const sql = `
              SELECT a.*,b.name AS loc_name
              FROM app_users as A
              LEFT JOIN shopee_location as B ON A.loc_id = B.id
              WHERE user_type='saragam'
             `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching users" });
    }
    res.status(200).json(results);
  });
};

// UPDATE USER DETAILS
export const updateUser = (req, res) => {
  const { id, first_name, last_name, loc_id, status, email } = req.body;
  const aql = `UPDATE app_users SET first_name = ?, last_name = ?, loc_id = ?, status = ?, email = ? WHERE id = ?`;
  db.query(aql, [first_name, last_name, loc_id, status, email, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating user" });
    }
    res.json({ message: "User updated successfully", results });
  });

};

// GET ALL QUESTIONS
export const getAllQuestions = (req, res) => {
  const { flag } = req.body;
  const u_role = `%${flag}%`;

  const sql = `SELECT id, seq_id, question, status, week, u_role FROM questions WHERE u_role LIKE ?`;
  db.query(sql, [u_role], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching questions" });
    }
    res.status(200).json(results);
  });
};

// UPDATE QUESTION
export const updateQuestion = (req, res) => {
  const { question, status, id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required to update the question." });
  }

  let fields = [];
  let values = [];

  if (question) {
    fields.push('question = ?');
    values.push(question);
  }

  if (status) {
    fields.push('status = ?');
    values.push(status);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update." });
  }

  const sql = `UPDATE questions SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating question" });
    }
    res.json({ message: "Question updated successfully", results });
  });
};
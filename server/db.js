import mysql from 'mysql';

const db = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'server',
  password: 'osho#0540',
  database: 'postdb',
});

db.on('connection', (connection) => {
  console.log('Connected to database');
  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    } else {
      console.error('Database error:', err);
    }
  });
});

function handleDisconnect() {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      connection.release();
    }
  });
}

handleDisconnect();

setInterval(() => {
  db.query('SELECT 1', (err) => {
    if (err) {
      console.error('Keep-alive query error:', err);
    }
  });
}, 60000);

export default db;
const db = require('../config/db');

const User = {
  create: (user, callback) => {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [user.username, user.email, user.password], callback);
  },
  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  },
};

module.exports = User;

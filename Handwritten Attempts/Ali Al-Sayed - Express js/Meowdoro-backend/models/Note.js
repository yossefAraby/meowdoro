const db = require('../config/db');

const Note = {
  create: (note, userId, callback) => {
    const sql = 'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)';
    db.query(sql, [note.title, note.content, userId], callback);
  },
  getAll: (userId, callback) => {
    const sql = 'SELECT * FROM notes WHERE user_id = ?';
    db.query(sql, [userId], callback);
  },
  update: (noteId, userId, note, callback) => {
    const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?';
    db.query(sql, [note.title, note.content, noteId, userId], callback);
  },
  delete: (noteId, userId, callback) => {
    const sql = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
    db.query(sql, [noteId, userId], callback);
  },
};

module.exports = Note;

const Note = require('../models/Note');

exports.createNote = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  Note.create({ title, content }, userId, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating note.' });
    res.status(201).json({ message: 'Note created.' });
  });
};

exports.getNotes = (req, res) => {
  const userId = req.user.id;

  Note.getAll(userId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching notes.' });
    res.json(results);
  });
};

exports.updateNote = (req, res) => {
  const { title, content } = req.body;
  const noteId = req.params.id;
  const userId = req.user.id;

  Note.update(noteId, userId, { title, content }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating note.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found.' });
    res.json({ message: 'Note updated successfully.' });
  });
};

exports.deleteNote = (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  Note.delete(noteId, userId, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting note.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found.' });
    res.json({ message: 'Note deleted successfully.' });
  });
};

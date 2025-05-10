const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    User.create({ username, email, password: hash }, (err, result) => {
      if (err) return res.status(500).json({ message: 'User already exists or error.' });
      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
};

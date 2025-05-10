const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





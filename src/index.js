'use strict';

const express = require('express');
const db = require('./db/models'); 
const route = require('./routes/route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);

app.listen(PORT, async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log(`Server is running on ${PORT}`);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});

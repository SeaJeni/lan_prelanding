'use strict';

const express = require('express');
const db = require('./db/models'); // Sequelize index.js автоматически экспортирует объект
const route = require('./routes/route'); // твой роутер

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(route);

app.listen(PORT, async () => {
  try {
    await db.sequelize.sync({ alter: true }); // синхронизация моделей
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});

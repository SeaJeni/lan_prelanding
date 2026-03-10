'use strict';

const startDeployPrelandingCron = require('./cron/deployPrelandingСron');
const startPushTaskCron = require('./cron/pushTaskCron');

const express = require('express');
const db = require('./db/models'); 
const route = require('./routes/route');
const passport = require('passport');
const path = require('path');

require('./auth/passport'); 


const app = express();
const PORT = process.env.PORT || 3000;
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);
app.use(passport.initialize());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

startDeployPrelandingCron();
startPushTaskCron();

app.listen(PORT, async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log(`Server is running on ${PORT}`);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});

const express = require('express');
const router = express.Router();
const PrelandingController = require("../controllers/prelandingController");
const SubscriptionsController = require("../controllers/subscriptionsController");
const AuthController = require('../controllers/authController');

router.post("/api/prelanding/create", PrelandingController.create);
router.get("/api/prelanding/data", PrelandingController.data);

router.post("/api/subscriptions/email", SubscriptionsController.email);
router.post("/api/subscriptions/push", SubscriptionsController.push);

router.post('/api/auth/register', AuthController.register);
router.post('/api/auth/login', AuthController.login);

module.exports = router;
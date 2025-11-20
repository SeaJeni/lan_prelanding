const express = require('express');
const router = express.Router();
const PrelandingController = require("../controllers/prelandingController");
const SubscriptionsController = require("../controllers/subscriptionsController");

router.post("/api/prelanding/create", PrelandingController.create);
router.get("/api/prelanding/data", PrelandingController.data);

router.post("/api/subscriptions/email", SubscriptionsController.email);

module.exports = router;
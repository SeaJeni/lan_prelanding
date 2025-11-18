const express = require('express');
const router = express.Router();
const PrelandingController = require("../controllers/prelandingController");

router.post("/api/prelanding/create", PrelandingController.create);
router.get("/api/prelanding/data", PrelandingController.data);

module.exports = router;
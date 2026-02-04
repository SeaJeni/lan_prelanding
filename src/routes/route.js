const express = require('express');
const router = express.Router();
const passport = require('passport');
const PrelandingController = require("../controllers/prelandingController");
const SubscriptionsController = require("../controllers/subscriptionsController");
const AuthController = require('../controllers/authController');
const { signToken } = require('../helpers/jwt');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadPush');

router.post("/api/prelanding/create", authMiddleware, PrelandingController.create);
router.get("/api/prelanding/data", PrelandingController.data);

router.post("/api/subscriptions/email", SubscriptionsController.email);
router.post("/api/subscriptions/push", SubscriptionsController.push);
router.post("/api/subscriptions/push/tasks",  upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]), SubscriptionsController.tasks);

router.post('/api/auth/register', AuthController.register);
router.post('/api/auth/login', AuthController.login);

router.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false, }));
router.get( '/api/auth/google/callback', passport.authenticate('google', {session: false, failureRedirect: '/api/auth/login',}),
  (req, res) => {
    const token = signToken(req.user);

    return res.json({
      accessToken: token,
      tokenType: 'Bearer',
    });
  }
);

module.exports = router;
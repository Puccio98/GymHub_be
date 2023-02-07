const express = require('express');
const authController = require ('../controllers/auth-controller');

const router = express.Router();

// region get routes
// endregion

// region post routes
router.post('/login', authController.login);
// endregion

module.exports = router;


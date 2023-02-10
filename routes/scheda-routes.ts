const express = require('express');
const schedaController = require ('../controllers/scheda-controller');

const router = express.Router();

// region get routes
router.get('/getScheda', schedaController.getScheda);
// endregion

// region post routes
router.post('/postScheda', schedaController.postNewScheda);
// endregion

module.exports = router;

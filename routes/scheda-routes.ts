const express = require('express');
const schedaController = require ('../controllers/scheda-controller');

const router = express.Router();

// region get routes
// endregion

// region post routes
router.post('/scheda/fetchExercises', schedaController.fetchExercises);
router.post('/scheda/postScheda', schedaController.postNewScheda);
// endregion

module.exports = router;

export {}

const express = require('express');
const router = express.Router();
const weekController = require('../controllers/weekController')

router.get('/week', weekController.getWeek);
router.put('/week/:day', weekController.updateDayMeal);
router.delete('/week/meals', weekController.deleteMeals);

module.exports = router;

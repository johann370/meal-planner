const express = require('express');
const groceryListController = require('../controllers/groceryListController')

const router = express.Router();
router.get('/grocery-list', groceryListController.getGroceryList);

module.exports = router;
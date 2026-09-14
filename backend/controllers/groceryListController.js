const groceryListService = require('../services/groceryListService');


const getGroceryList = async (req, res) => {
    const groceryList = await groceryListService.getGroceryList();

    res.json(groceryList);
}

module.exports = { getGroceryList }
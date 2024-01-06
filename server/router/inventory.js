const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const inventory = require('../model/checkInventory');

router.use(bodyParser.json());

router.post('/inventory', async (req, res) => {
  const {
    productName,
    availableStocks,
    currentStocks,
    unitPrice,
    stockLocation,
    stockStatus
  } = req.body;

  try {
    const result = await inventory.insertMany({
      productName,
      availableStocks,
      currentStocks,
      unitPrice,
      stockLocation,
      stockStatus
    });
    res.json(result);
  } catch (error) {
    console.log('error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/inventory', async (req, res) => {
  try {
    const inventoryItems = await inventory.find({});
    res.json(inventoryItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/inventory/:id', async (req, res) => {
  const itemId = req.params.id;
  const updateFields = req.body;

  try {
    const updatedItem = await inventory.findByIdAndUpdate(itemId, { $set: updateFields }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

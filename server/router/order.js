const express = require('express');
const router = express.Router();
const orderReceived = require('../model/orderReceived')

router.post("/order", async (req, res) => {
  const {
    productName,
    quantity,
    orderDate,
    deliveryDate,
    deliveryAddress,
    paymentStatus,
  } = req.body;

  try {
    // Assuming orderRecieved is your MongoDB collection
    const result = await orderReceived.insertMany({
      productName,
      quantity,
      orderDate: new Date(orderDate),
      deliveryDate: new Date(deliveryDate),
      deliveryAddress,
      paymentStatus,
    });
    res.json(result);

    console.log("Order inserted successfully:", result);
  } catch (error) {
    console.error("Error inserting order:", error);
  }
});
  
router.get("/order", async (req, res) => {
  try {
    const i = await orderReceived.find({});
    res.json(i);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const manufacturing = require('../model/Manufacturing.js');
const orderReceived = require('../model/orderReceived.js');
const mongoose = require("mongoose");

const calculateResourcesRequired = (quantity, productName) => {
  const resourcesPerUnit = 5; // Example: 5 resources per unit

  // Ensure quantity is a number
  const parsedQuantity = parseInt(quantity, 10);

  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    throw new Error('Invalid quantity');
  }

  return `${parsedQuantity * resourcesPerUnit} ${productName} Resources`;
};


router.post("/manufacture", async (req, res) => {
    const {
      orderNumber,
      // productName, 
      // resourcesRequired,
      expectedCompletionDate,
      workingStatus,
      productionNotes,
      qualityControlInformation,
    } = req.body;

    // Fetch the corresponding order to get quantity and productName
    const order = await orderReceived.findById(orderNumber);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { quantity, productName , deliveryDate} = order;

    // Calculate resourcesRequired based on quantity and productName
    const resourcesRequired = calculateResourcesRequired(quantity, productName);

    // Check if expectedCompletionDate is less than deliveryDate
    if (new Date(expectedCompletionDate) >= new Date(deliveryDate)) {
      return res.status(400).json({ error: 'Expected completion date must be before the delivery date' });
    }
  
    try {
      // Assuming orderRecieved is your MongoDB collection
      const result = await manufacturing.insertMany({
        orderNumber,
        productName, 
        resourcesRequired,
        expectedCompletionDate,
        workingStatus,
        productionNotes,
        qualityControlInformation,
      });
      res.json(result);
  
      console.log("Order inserted successfully:", result);
    } catch (error) {
      console.error("Error inserting order:", error);
    }
  });

  // router.put("/manufacture/:orderNumber", async (req, res) => {
  //   try {
  //     const orderNumber = req.params.orderNumber;
  //     const {
  //       resourcesRequired,
  //       workingStatus,
  //       expectedCompletionDate,
  //       productionNotes,
  //       qualityControlInformation
  //     } = req.body;
  //     console.log(orderNumber);
  
  //     const updatedManufacturing = await manufacturing.findOneAndUpdate(
  //       { orderNumber: orderNumber },
  //       {
  //         $set: {
  //           workingStatus: workingStatus,
  //           resourcesRequired: resourcesRequired,
  //           expectedCompletionDate: expectedCompletionDate,
  //           productionNotes: productionNotes,
  //           qualityControlInformation: qualityControlInformation
  //         }
  //       },
  //       { new: true } // Returns the modified document
  //     );
  
  //     if (!updatedManufacturing) {
  //       return res.status(404).json({ error: 'Manufacturing record not found' });
  //     }
  
  //     res.json({ updatedManufacturing });
  
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  

// Route to handle the PUT request for updating a manufacturing document
router.put('/manufacture/:orderNumber', async (req, res) => {
  const orderNumber = req.params.orderNumber;

  try {
    // Find the manufacturing document by orderNumber
    const manufacturingDocument = await manufacturing.findOne({ orderNumber });

    if (!manufacturingDocument) {
      return res.status(404).json({ error: 'Manufacturing document not found' });
    }

    // Update the fields based on the request body
    manufacturingDocument.resourcesRequired = req.body.resourcesRequired || manufacturingDocument.resourcesRequired;
    manufacturingDocument.expectedCompletionDate = req.body.expectedCompletionDate || manufacturingDocument.expectedCompletionDate;
    manufacturingDocument.workingStatus = req.body.workingStatus || manufacturingDocument.workingStatus;
    manufacturingDocument.productionNotes = req.body.productionNotes || manufacturingDocument.productionNotes;
    manufacturingDocument.qualityControlInformation = req.body.qualityControlInformation || manufacturingDocument.qualityControlInformation;

    // Save the updated document
    const updatedDocument = await manufacturingDocument.save();

    res.json(updatedDocument);
  } catch (error) {
    console.error('Error updating manufacturing document:', error);
    // Log the error and send a more informative response
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});




    
router.get("/manufacture", async (req, res) => {
  try {
    const i = await manufacturing.find({});
    res.json(i);
  } catch (err) {
    console.log(err);
  }
});


  module.exports = router;
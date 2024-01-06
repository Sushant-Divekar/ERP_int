const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
    productName: {
        type:String,
        required : true,
    },
    availableStocks: {
        type:String,
        required : true,
    },
    
    currentStocks: {
        type:Number,
        required : true,
    },
    unitPrice:{
        type:Number,
        required : true,
    },
    stockLocation: {
        type:String,
        required : true,
    },
    stockStatus: {
        type: String,
        enum: ['In Stock', 'Out of Stock'],

    }
  });

  const inventory = mongoose.model('inventory', inventorySchema);
  module.exports=inventory;

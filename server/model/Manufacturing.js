const mongoose = require("mongoose");

const manufacturingSchema = mongoose.Schema({
    orderNumber: {
        type: String, 
        ref: 'orderReceived',
        unique: true,
      },
    productName : {
        type : String ,
        required : true
    },
    resourcesRequired: {
      type: String,
      required: true,
    },
    expectedCompletionDate: {
      type: Date,
      required: true,
    },
    workingStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    productionNotes: {
      type: String,
    },
    qualityControlInformation: {
      type: String,
    },

});

const manufacturing = mongoose.model('manufacturing', manufacturingSchema);

module.exports = manufacturing;
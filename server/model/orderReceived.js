const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    productName : {
        type : String ,
        required : true
    },
    orderDate: {
        type: Date,
        // default: Date.now,
    },
    quantity: {
        type: Number,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Partially Paid'],
        default: 'Pending',
    },


});

const orderReceived = mongoose.model('orderReceived', orderSchema);

module.exports = orderReceived;
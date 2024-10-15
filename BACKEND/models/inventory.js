const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    ItemCode: {
        type: String,
        required: false
    },
    ItemName: {
        type: String,
        required: true
    },
    Quantity: {
        type: String,  // Consider changing this to a number if you want to store numeric quantities
        required: true
    },
    PreOrder: {
        type: String,  // Consider changing this to a boolean if it represents a true/false status
        required: true
    },
    ExpDate: {
        type: String,  // If you're storing dates as strings, keep this as a string
        required: true
    },
    ManDate: {
        type: String,  // If you're storing dates as strings, keep this as a string
        required: true
    },
    addedTime: { 
        type: Date, 
        default: Date.now 
    }
});


const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
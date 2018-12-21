const mongoose = require('mongoose');

// make sure to use the mongoose.Schema.whatever when designating the schema
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

// We want to export the schema wrapped in a model that contains our schema
// Model takes two arguments, the name we want to use ('uppercase convention'), and the schema
module.exports = mongoose.model('Order', orderSchema);
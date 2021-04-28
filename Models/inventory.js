const { model, Schema } = require('mongoose'); 
module.exports = model('inventory', new Schema({
    Guild: String,
    User: String,
    Inventory: Object,
    cash: { type: Number, default: 0 },
}))
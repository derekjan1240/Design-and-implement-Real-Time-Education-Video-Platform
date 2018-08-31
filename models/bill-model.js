const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
    hostMember: String,
    totalPrice: String,     //總商品價錢
    totalItem:  Number,     //總商品數目
    itemList: [String],     //商品列表
    active:{
        type: Boolean,
        default: false
    }
    
});

const Bill = mongoose.model('bill', billSchema);

module.exports = Bill;
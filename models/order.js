//order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	name: {type:String, required:true},
	cart: {type:Object, required:true},
	address: {type:String, required:true},
	email: {type:String, required:true},
	paymentId: {type:String, required:true}
});

module.exports = mongoose.model('Order', schema);
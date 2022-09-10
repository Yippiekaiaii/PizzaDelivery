const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
user:{type:Schema.Types.ObjectId, ref:'User'},
cart:{type:Object,required:true},
address:{type:String,required:true},
name:{type:String,required:true}
},{timestamps:true});


const Order = mongoose.model('Order',orderSchema); //creates a model based of the schema which interfaces with the DB, use singular as it will be automatically pluralised
module.exports = Order; //export the model to use elsewhere in the app

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
FirstName:{type:String,required:true},
LastName:{type:String,required:true},
email:{type:String,required:true},
password:{type:String,required:true}
},{timestamps:true});

const User = mongoose.model('User',userSchema); //creates a model based of the schema which interfaces with the DB, use singular as it will be automatically pluralised
module.exports = User; //export the model to use elsewhere in the app


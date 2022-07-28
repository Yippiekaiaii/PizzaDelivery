const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offersSchema = new Schema({
strapline:{
            type:String,
            required:true
},
message:{
            type:String,
            required:true
},
image:{
            type:String,
            required:true
},
expirey:{
            type:Date,
            required:true
}
},{timestamps:true});

const Offer = mongoose.model('Offer',offersSchema); //creates a model based of the schema which interfaces with the DB, use singular as it will be automatically pluralised
module.exports = Offer; //export the model to use elsewhere in the app

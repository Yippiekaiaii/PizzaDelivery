const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs'); //allows the hashing of passwords

const userSchema = new Schema({
email:{type:String,required:true},
password:{type:String,required:true}
},{timestamps:true});

//Method for encrypting passwords
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
}

//Method for checking a password against its hash
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password); //in this case this. refers to the current user
}

const User = mongoose.model('User',userSchema); //creates a model based of the schema which interfaces with the DB, use singular as it will be automatically pluralised
module.exports = User; //export the model to use elsewhere in the app


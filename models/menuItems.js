const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema ({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,        
    },
    vegitarian:{
        type:Boolean,
        required:true,        
    },
    vegan:{
        type:Boolean,
        required:true,        
    },
    price:{
        type:Number,
        required:true,        
    },
    category:{
        type:String,
        enum:['Pizza','Garlic Bread','Sides','Drinks','Misc'],
        required:true,        
    },
    image:{
        type:String,
        required:true,        
    }
    },{timestamps:true});

    const MenuItem = mongoose.model('MenuItem',menuItemSchema);
    module.exports = MenuItem;

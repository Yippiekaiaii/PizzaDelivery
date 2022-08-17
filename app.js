
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

//Connect to mongoose DB
const dotenv = require('dotenv'); //allows use of .env file for environment variables
dotenv.config()
mongoose.connect(process.env.CONNECTIONSTRING,{useNewUrlParser: true, useUnifiedTopology:true})
    .then((result) => app.listen(5000), console.log('connected to db'))
    .catch((err) => console.log(err));

//Allows access to all the different paraments from the input forms inside of our article route
app.use(express.urlencoded({extended:true})); 

//Allows us to use express to upload the images for new offers
app.use(fileUpload());

//Set Express Layouts and set location of main layout
app.use(expressLayouts);
app.set('layout','./layouts/main.ejs');

//Set ejs as the view engine
app.set('view engine', 'ejs');

//Set location for static Assets
app.use(express.static('public')); 

//Set Router File Location
const pizzaRouter = require ('./server/Routes/pizzaRoutes.js');
app.use (('/'),pizzaRouter);




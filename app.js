
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

//Connect to mongoose DB
const dbURI = 'mongodb+srv://Yippiekaiaii:Hullcity1@cluster0.xls3m.mongodb.net/Pizza?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology:true})
    .then((result) => app.listen(5000), console.log('connected to db'))
    .catch((err) => console.log(err));

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




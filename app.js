
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');


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



app.listen(5000);
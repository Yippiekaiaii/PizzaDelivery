
console.log("attemping to run app.js");

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const mongostore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const passport = require('passport');
const flash = require('connect-flash');



//Connect to mongoose DB
const dotenv = require('dotenv'); //allows use of .env file for environment variables
dotenv.config()

//Connection String
const connectString = process.env.CONNECTIONSTRING;

//Connect to mongoDB database
mongoose.connect(connectString,{useNewUrlParser: true, useUnifiedTopology:true})
    .then((result) => app.listen(process.env.PORT || 5000), console.log('Listening on port 5000 and connected to mongodb'))
    .catch((err) => console.log(err));

require('./config/passport.js'); //run the passport setup script

//Set express-session to handle user session
app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false,      
    cookie: {maxAge: 60*60*1000} //60 mins - adjust first figure to adjust session expirey in mins
}));

//Initialise Flash Messages (uses session so must be after it)
app.use(flash());

//Initialise Passport to handle user login and then set it to use the session middleware(uses session so must be after it)
app.use(passport.initialize());
app.use(passport.session());

//Middleware to make the isAuthenticated method be available to all views
app.use(function(req,res,next){
    res.locals.login = req.isAuthenticated(); //login is the variable it is assigned to and will be either true or false depending on passport login state
    next();
})

//Expose Session User name to all Views
app.use(function(req,res,next){  
    res.locals.user = req.user;
   next();
})

//Expose Current Basket Qty to all views
app.use(function(req,res,next){    
    let cart = (req.session.cart);
    if(cart){
    res.locals.basketQty = cart.totalQty;
    } else {
        res.locals.basketQty = 0;
    }
    next();
})


//Allows access to all the different paraments from the input forms inside of our article route
app.use(express.urlencoded({extended:true})); 

//Allows us to use express to upload the images for new offers
app.use(fileUpload());

//Set Express Layouts and set location of main layout
app.use(expressLayouts);
app.set('layout','./layouts/main.ejs');

//Set ejs as the view engine
app.set('view engine', 'ejs');

//Cookie Parser middleware
app.use(cookieParser());


//Set location for static Assets
app.use(express.static('public')); 

//Set Router File Location
const pizzaRouter = require ('./server/Routes/pizzaRoutes.js');
app.use (('/'),pizzaRouter);




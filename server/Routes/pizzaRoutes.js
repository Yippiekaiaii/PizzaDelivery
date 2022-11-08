const express = require ('express');
const router = express.Router();
const pizzaController = require("../controllers/pizzaController.js");
const checkOutController = require("../controllers/checkOutController.js");
const userController = require("../controllers/userController.js");
const ordersController = require("../controllers/ordersController.js");
const passport = require("passport");


//Add csurf for CSRF proection 
const csrf = require("csurf");
let csrfProtection = csrf();
router.use(csrfProtection);

//Routes
router.get('/', pizzaController.homepage);
router.get('/admin', pizzaController.admin);
router.post('/submitOffer',pizzaController.submitOffer);
router.post('/editOfferItem/:id',pizzaController.editOfferItem);
router.get('/offerlist', pizzaController.offerlist);
router.post('/deleteOffer/:id',pizzaController.deleteOffer);
router.get('/menu',pizzaController.menu);
router.get('/editMenu',pizzaController.editMenu);
router.post('/submitMenuItem',pizzaController.submitMenuItem);
router.get('/cart',pizzaController.cart);
router.post('/addToCart/:id/:name/:price',pizzaController.addToCart);
router.get('/reduce/:id',pizzaController.reduceItem);
router.get('/deleteItem/:id',pizzaController.deleteItem);
router.get('/increaseItem/:id',pizzaController.increaseItem);
router.get('/about', pizzaController.about);
router.get('/checkout', checkOutController.checkout);
router.get('/signup', userController.signup);
router.post('/signup', userController.signupSubmit);
router.get('/signin', notLoggedIn,userController.signin);
router.post('/signin',notLoggedIn,userController.signinSubmit);
router.get('/profile',isLoggedIn,isAdmin,userController.profile);
router.get('/logout',isLoggedIn,userController.logout);
router.post('/checkout',isLoggedIn,ordersController.checkout);
router.post('/deleteMenuItem/:id',pizzaController.deleteMenuItem);
router.post('/editMenuItem/:id', pizzaController.editMenuItem);
router.get('/deleteOrder/:id',ordersController.deleteOrder);
router.get('/orders',isLoggedIn,pizzaController.orders);
router.post('/changeStatus/:id',isLoggedIn,pizzaController.changeStatus);
router.get('/contact',pizzaController.contact);
router.post('/sendEmail',pizzaController.sendEmail);

module.exports=router;


//Function to protect a route if the user is not logged in
function isLoggedIn(req,res,next){    
    if (req.isAuthenticated()) {      
        return next();
    }  
    res.redirect('/');
}

//Function to protect a route if the user IS logged in
function notLoggedIn(req,res,next){  
    if (!req.isAuthenticated()) {
       return next();
    }    
    res.redirect('/');
}

//Function to forward direct to admin pages if profile is accessed when logging in as Admin
function isAdmin(req,res,next){   
    if (req.user.email == "admin@petespizzas.com"){
       res.redirect('/orders');
    } else {
        return next();
    }    
}
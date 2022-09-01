const express = require ('express');
const router = express.Router();
const pizzaController = require("../controllers/pizzaController.js");
const checkOutController = require("../controllers/checkOutController.js");
const userController = require("../controllers/userController.js");

//Add csurf for CSRF proection 
const csrf = require("csurf");
let csrfProtection = csrf();
router.use(csrfProtection);

//Routes
router.get('/', pizzaController.homepage);
router.get('/admin', pizzaController.admin);
router.post('/submitOffer',pizzaController.submitOffer);
router.get('/offerlist', pizzaController.offerlist);
router.post('/deleteOffer/:id',pizzaController.deleteOffer);
router.get('/menu',pizzaController.menu);
router.get('/editMenu',pizzaController.editMenu);
router.post('/submitMenuItem',pizzaController.submitMenuItem);
router.get('/cart',pizzaController.cart);
router.post('/addToCart/:id/:name/:price',pizzaController.addToCart);
router.get('/about', pizzaController.about);
router.get('/checkout', checkOutController.checkout);
router.get('/signup', userController.signup);
router.post('/signup', userController.signupSubmit);
router.get('/signin', userController.signin);
router.get('/profile',userController.profile);

module.exports=router;
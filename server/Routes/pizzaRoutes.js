const express = require ('express');
const router = express.Router();
const pizzaController = require("../controllers/pizzaController.js");
const checkOutController = require("../controllers/checkOutController.js");

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

module.exports=router;
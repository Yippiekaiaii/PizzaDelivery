const express = require ('express');
const router = express.Router();
const pizzaController = require("../controllers/pizzaController.js");

//Routes
router.get('/', pizzaController.homepage);
router.get('/admin', pizzaController.admin);
router.post('/submitOffer',pizzaController.submitOffer)

module.exports=router;
const express = require ('express');
const router = express.Router();
const pizzaController = require("../controllers/pizzaController.js");

//Routes
router.get('/', pizzaController.homepage);
router.get('/admin', pizzaController.admin);
router.post('/submitOffer',pizzaController.submitOffer);
router.get('/offerlist', pizzaController.offerlist);
router.post('/deleteOffer/:id',pizzaController.deleteOffer);
router.get('/menu',pizzaController.menu);
router.get('/editMenu',pizzaController.editMenu);
router.post('/submitMenuItem',pizzaController.submitMenuItem);

module.exports=router;
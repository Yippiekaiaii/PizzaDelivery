const express = require ('express');
const router = express.Router();
const pizzaController = require("../controllers/pizzaController.js");

//Routes
router.get('/', pizzaController.homepage);

module.exports=router;
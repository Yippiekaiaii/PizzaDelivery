const Offer = require('../../models/offers.js');
const MenuItem = require('../../models/menuItems');
let Cart = require('../../models/cart');

//GET /checkout
exports.checkout = async (req,res)=>{
    console.log('checkout')
    if (!req.session.cart){
        res.redirect('/cart');
    }
    try{  
        let cart = new Cart(req.session.cart);
        res.render('checkout', {total: cart.totalPrice,csrfToken: req.csrfToken()});
     } catch (error){
         console.log(error);
         res.status(500).send({message: error.message||"Error Occured"}); 
     }
}
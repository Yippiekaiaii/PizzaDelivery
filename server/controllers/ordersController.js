let Cart = require('../../models/cart');
let Order = require('../../models/order');


exports.checkout = async (req,res)=>{
    console.log('Checkout initiated');
    let cart = new Cart(req.session.cart);
    let order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name
    });
    order.save(function(err,result){
        if (err){
            console.log('Error has occured when posting order to db',err)
            res.redirect('/');
        } else {
        req.flash('sucess','Order Placed Sussessfully');
        res.redirect('/');
        }        
    });
   
}
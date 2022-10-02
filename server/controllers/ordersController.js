let Cart = require('../../models/cart');
let Order = require('../../models/order');


exports.checkout = async (req,res)=>{
    console.log('Checkout initiated');
    let cart = new Cart(req.session.cart);
    let order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        status: "pending"
    });
    order.save(function(err,result){
        if (err){
            console.log('Error has occured when posting order to db',err)
            res.redirect('/');
        } else {
        req.flash('sucess','Order Placed Sussessfully');
        res.redirect('/profile');
        }        
    });
   
}

exports.deleteOrder = async (req,res) => {
    const order = Order.findOne({_id: req.params.id});
    //console.log("this is the order", order);

    if (!order) {
        console.log("Error - No order found to delete")
     } else {       
            console.log("deleting order ", req.params.id);
            await Order.deleteOne({_id: req.params.id});   
     }
  
    res.redirect('/profile');
}
const Offer = require('../../models/offers.js');
const MenuItem = require('../../models/menuItems');
let Cart = require('../../models/cart');


//GET "/"
exports.homepage = async (req,res)=>{
    try{     

     const offers = await Offer.find({});
       
       res.render('index',{title:'Home Page', offers});

    } catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }
}

//GET "/admin"
exports.admin = async(req,res)=>{

    res.render('admin.ejs');
}

//POST "/submitOffer"
exports.submitOffer = async(req,res)=>{

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0){
        console.log("Error uploading image");
    }else{
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
        uploadPath = require('path').resolve('./') + '/public/uploads/'+ newImageName;
        imageUploadFile.mv(uploadPath, function(err){
            if (err) return res.status(500).send(err);
        })
    };

    const newOffer = new Offer({
        strapline: req.body.strapline,
        message: req.body.message,
        image: newImageName,
        expirey: req.body.expirey       
    });

    await newOffer.save()   
    .then((result)=>{  
     res.redirect('/');
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send({message: err.message||"Error Occured"});
    })

}


//GET /offerlist
exports.offerlist = async (req,res)=>{
  
    try{  
        const offers = await Offer.find({});          
          res.render('offers',{title:'Edit Offers', offers});   
       } catch (error){
           console.log(error);
           res.status(500).send({message: error.message||"Error Occured"}); 
       }
}

//POST /deleteRecord/:id
exports.deleteOffer = async (req,res)=>{    
    try{
        const deleteID = req.params.Offerid;
        const temp = await Offer.deleteOne(deleteID);
        console.log("Delete ID:", deleteID);
    
        const offers = await Offer.find({});   
        res.render('offers',{title:'Edit Offers', offers}); 
    }  catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }   
}

//GET /menu
exports.menu = async (req,res) => {
    try{
        const menuItemsPizza = await MenuItem.find({'category':'Pizza'});
        const menuItemsGarlic = await MenuItem.find({'category':'Garlic Bread'});
        const menuItemsSides = await MenuItem.find({'category':'Sides'});
        const menuItemsDrinks = await MenuItem.find({'category':'Drinks'});
        res.render('menu',{title:'Menu',menuItemsPizza,menuItemsGarlic,menuItemsSides,menuItemsDrinks});
    }  catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }   

}

//GET editMenu
exports.editMenu = async (req,res) => {
    try{
        const menuItems = await MenuItem.find({});   
        res.render('editMenu',{title:'Edit Menu', menuItems});
    }  catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }   
}

//POST submitMenuItem
exports.submitMenuItem = async (req,res)=>{
    try{

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;

        let veganState = req.body.vegan;
        let vegitarianState = req.body.vegitarian;        
        if (veganState == 'on'){
            veganState = true;
        } else {
            veganState = false;
        }
        if (vegitarianState == 'on'){
            vegitarianState = true;
        } else {
            vegitarianState = false;
        }

        const newMenuItem = new MenuItem({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            vegitarian: vegitarianState,
            vegan: veganState,
            price: req.body.price,
            image: newImageName
        })

        await newMenuItem.save()   
        .then((result)=>{  
            const menuItems = MenuItem.find({});  
            console.log(menuItems); 
            res.render('editMenu',{title:'Edit Menu', menuItems});
           
         })
        .catch((err)=>{
            console.log(err);
            res.status(500).send({message: err.message||"Error Occured"});
         })
       
    }  catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }  
}

//GET /cart
exports.cart = async(req,res)=>{

    if (!req.session.cart){       
           res.render('cart', {products:null});
            console.log("No cart found");       
    } 
    let cart = new Cart(req.session.cart);
    console.log(cart);
    res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice}); 
  //res.render('cart'); 
}

//POST /addToCart/:id
exports.addToCart = async(req,res) =>{  
    try{    

        if (!req.session.viewCount==1){
            req.session.viewCount = 1;
        } else { 
            req.session.viewCount +=1;
            console.log(req.session.viewCount, req.sessionID);
        }
        
        console.log("body=",req.body," session id=",req.sessionID, " params=",req.params);       
          
        try {
        //See functions in cart.js in models folder 
        let productId = req.params.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {items: {}}); //checks if the session cart alread exists, if not it passes and empty JS object        
                
        MenuItem.findById(productId,function(err,product){           
           if (err) {
               return res.redirect('/menu');
           }                         
               cart.add(product,product.id);           
               req.session.cart = cart;            
               console.log(req.session.cart);               
           })       
        } catch (error){
            console.log(error);
            res.status(500).send({message: error.message||"Error Occured"}); 
        }

        //reload the page after items added to cart
        const menuItemsPizza = await MenuItem.find({'category':'Pizza'});
        const menuItemsGarlic = await MenuItem.find({'category':'Garlic Bread'});
        const menuItemsSides = await MenuItem.find({'category':'Sides'});
        const menuItemsDrinks = await MenuItem.find({'category':'Drinks'});
        res.render('menu',{title:'Menu',menuItemsPizza,menuItemsGarlic,menuItemsSides,menuItemsDrinks});
        console.log("Item Added to Basket");
        
    }  catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    } 
}


//GET /about
exports.about = async(req,res)=>{    
           res.render('about');             
   
}


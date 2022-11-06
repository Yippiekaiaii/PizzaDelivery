const Offer = require('../../models/offers.js');
const MenuItem = require('../../models/menuItems');
const Orders = require('../../models/order.js')
let Cart = require('../../models/cart');
const fs = require('fs');
const { Console } = require('console');
const { getDiffieHellman } = require('crypto');


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

    res.render('admin.ejs',{csrfToken: req.csrfToken()});
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
          res.render('offers',{title:'Edit Offers', offers,csrfToken: req.csrfToken()});   
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
        res.render('offers',{title:'Edit Offers', offers,csrfToken: req.csrfToken()}); 
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
        res.render('menu',{csrfToken: req.csrfToken(),title:'Menu',menuItemsPizza,menuItemsGarlic,menuItemsSides,menuItemsDrinks});
    }  catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }   

}

//GET editMenu
exports.editMenu = async (req,res) => {
    try{
        const menuItems = await MenuItem.find({});   
        res.render('editMenu',{title:'Edit Menu', menuItems,csrfToken: req.csrfToken()});
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
        uploadPath = require('path').resolve('./') + '/public/uploads/'+ newImageName;
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
            res.redirect('/editMenu');
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


//POST /deleteMenuItem
exports.deleteMenuItem = async(req,res)=>{
    console.log('delete menu item');
    const deleteID = req.params.id;
    console.log(deleteID);
    const checkRecord = MenuItem.findOne({_id:deleteID});

    let menuItem = await MenuItem.findOne({_id:deleteID});  
    let menuImageName = menuItem.image;
    let imageFolderPath = './public/uploads/';
    let imageFilePath = imageFolderPath + menuImageName;
    console.log("Image Filepath = ", imageFilePath);
    
    //Delete DB record
    if (!checkRecord) {
        console.log("Record Does Not Exist");
    } else {
        console.log("Record Found...Proceeding to delete");
        try{
           await MenuItem.deleteOne({_id:deleteID});   
           } catch (err) {
               console.log(err);
               res.status(500).send({message: error.message||"Error Occured"}); 
           }            

           //Delete image from server
           if (!menuImageName) {
             console.log("No image found in the database for deleted record");             
           } else {
                if (fs.existsSync(imageFilePath)){
                    console.log("Image File Found - proceeding to delete")
                    try {                    
                        fs.unlink(imageFilePath, (err =>{
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Image Deleted")
                            }
                        }));
                       
                    } catch (err) {
                        console.log("error=", err.message, " Image has not been deleted");
                    }
                } else {
                    console.log("Image File not found")
                }; 
           }
    }  
    
    res.redirect('/editMenu');
}

//POST /editMenuItem/:id
exports.editMenuItem = async (req,res) => {
    const editID = req.params.id;
    const checkMenuItem = MenuItem.findOne({_id:editID});
    //console.log("Record to edit", editID);      
    let veganSet = false;
    let vegiSet = false;    

    if (req.body.evegan == "on"){
        veganSet = true;
    } else {
        veganSet = false;
    }

    if (req.body.evegitarian == "on"){
        vegiSet = true;
    } else {
        vegiSet = false;
    }

    const editFields = {
        name: req.body.ename,
        description: req.body.edescription,
        price: req.body.eprice,
        category: req.body.ecategory,
        vegitarian: vegiSet,
        vegan: veganSet
    }

    if (!checkMenuItem){
        console.log("Error - item not found to update");
    } else {
        await checkMenuItem.updateOne({name:editFields.name,description:editFields.description,price:editFields.price,category:editFields.category,vegan:editFields.vegan,vegitarian:editFields.vegitarian})
        
    }
    res.redirect('/editMenu');
}


//GET /cart
exports.cart = async(req,res)=>{

    if (!req.session.cart){       
           res.render('cart', {csrfToken: req.csrfToken(),products:null});
            console.log("No cart found");       
    } else {
    let cart = new Cart(req.session.cart);
    //console.log(cart);
    //console.log(cart.generateArray())
    res.render('cart', {csrfToken: req.csrfToken(),products: cart.generateArray(), totalPrice: cart.totalPrice}); 
    }
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
               return res.redirect('/menu',{csrfToken: req.csrfToken()});
           }        
               let qty = req.body.qty;                 
               cart.add(product,product.id,qty);           
               req.session.cart = cart;           
                           
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
        res.redirect('/menu');
        //res.render('menu',{title:'Menu',menuItemsPizza,menuItemsGarlic,menuItemsSides,menuItemsDrinks,csrfToken: req.csrfToken()});
        console.log("Item Added to Basket");
        
    }  catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    } 
}

//GET /reduce/:id
exports.reduceItem = async(req,res)=>{
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
}

//GET /increaseItem/:id
exports.increaseItem = async(req,res)=>{
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.increaseByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
}

//GET /deleteItem/:id
exports.deleteItem = async(req,res)=>{
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.deleteItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
}

//GET /about
exports.about = async(req,res)=>{     
           res.render('about');             
   
}

//GET /orders
exports.orders = async(req,res)=>{
    const orders = await Orders.find({});

    let cart;
    let orderItems;
    orders.forEach(function(order){            
        cart = new Cart(order.cart);          
        orderItems = cart.generateArray();    
        //console.log(orderItems);   
    });
    //console.log(orderItems);  

    res.render('orders',{orders,csrfToken: req.csrfToken(),items:orderItems});   
}

//POST /changeStatus/:id
exports.changeStatus = async(req,res)=>{
        let getID = req.params.id;       
        let findRecord = await Orders.findOne({_id:getID});           
        if (!findRecord){
            console.log('error no ID')
        } else {
        await Orders.updateOne({_id:getID},{$set:{status:req.body.status}});        
        }
        res.redirect('/orders');
}


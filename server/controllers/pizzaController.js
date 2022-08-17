const Offer = require('../../models/offers.js');
const MenuItem = require('../../models/menuItems');


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

        res.render('menu');
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
            vegitarian: vegitarianState,
            vegan: veganState,
            price: req.body.price,
            image: newImageName
        })

        await newMenuItem.save()   
        .then((result)=>{  
            res.render('editMenu');
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
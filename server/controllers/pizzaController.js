const Offer = require('../../models/offers.js');



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

    const newOffer = new Offer({
        strapline: req.body.strapline,
        message: req.body.message,
       image: req.body.image,
        expirey: req.body.expirey       
    });

    await newOffer.save()   
    .then((result)=>{
     //   res.send(result)
     res.redirect('/');
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send({message: err.message||"Error Occured"});
    })

}

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
        //strapline: req.body.strapline,
       // message: req.body.message,
       // image: req.body.image,
        //expirey: req.bosy.expirey

        strapline: 'Buy One Get One Free',
        message: 'Why not settle for just one of our amazing pizzas when you can have two at no extra cost',
        image: 'test',
        expirey: Date()
    });

    await newOffer.save()
    .then((result)=>{
        res.send(result)
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send({message: err.message||"Error Occured"});
    })

}

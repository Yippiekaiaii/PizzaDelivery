

//GET "/"

exports.homepage = async (req,res)=>{
    try{

        const offers = [{
            title:'Test Title 1',
            body:'Test Body',
            img:'Test Image'
        },
        {
            title:'Test Title 2',
            body:'Test Body',
            img:'Test Image'

        }]

        res.render('index.ejs',{offers: offers});
    } catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"});
    }
}
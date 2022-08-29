


//GET /signup

exports.signup = async (req,res)=>{
    try{   
     res.render('user/signup', { csrfToken: req.csrfToken() });
     //res.render('user/signup');
    } catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }
}

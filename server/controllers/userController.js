const passport = require("passport");


//GET /signin
exports.signin = async (req,res)=>{
    try{   
     let messages = req.flash('error'); //gets any error flash messages from the post method
     res.render('user/signin', { csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0});   
    } catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }
}

//POST /signin
exports.signinSubmit = passport.authenticate('local.signin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true //flashes the message set in passport.js 
})

//GET /logout
exports.logout = async (req,res)=>{
    req.logout(function(err){   //passport function that logs the user out
        if (err) {
            return next(err);
        }
        res.redirect('/');
    }); 
   
}

//GET /signup
exports.signup = async (req,res)=>{
    try{   
     let messages = req.flash('error'); //gets any error flash messages from the post method
     res.render('user/signup', { csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length>0});     
    } catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }
}

//POST /signup
exports.signupSubmit = 
    passport.authenticate('local.signup',{
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true //flashes the message set in passport.js 
    })

//GET /profile
exports.profile = async (req,res)=>{
    //isLoggedIn()
    try{   
     res.render('user/profile', { csrfToken: req.csrfToken() });   
    } catch (error){
        console.log(error);
        res.status(500).send({message: error.message||"Error Occured"}); 
    }
}




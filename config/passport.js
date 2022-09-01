//Set up passport to use local storage for user login

const passport = require('passport');
const User = require('../models/user.js');
const LocalStrategy = require('passport-local').Strategy;

//tells passport how to store user in the session
passport.serializeUser(function(user,done){ 
    done(null,user.id); //when ever we save user in the session serialise it by id

}); 

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    })
})

passport.use('local.signup', new LocalStrategy ({
    //firstnameField:'firstname',
    //lastnameField:'lastname',    
    usernameField:'email',
    passwordField:'password',    
    passReqToCallback: true
}, function(req, email, password,done){
    User.findOne({'email':email},function(err,user){
        if (err) {
            return done(err); //return if error
        }
        if (user) {
            return done(null,false,{message:'email is already in use'}) //return if email already exist and passes a message to flash
        }

        //If user doesn exist and no errors then create new user in mongoDB
        let newUser = new User();
        newUser.email = email;
       // newUser.firstname = firstname;
       // newUser.lastname = lastname;
        newUser.password = newUser.encryptPassword(password); //uses method from user.js to encrypt password
        newUser.save(function(err,result){
            if (err) {
                return console.log(err);
            }
            return done(null, newUser);
        });

    });
}));
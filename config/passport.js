//Set up passport to use local storage for user login

console.log('Passport Script Init');
const emailvalidator = require('email-validator')

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

//sign up strategy for creating new user
passport.use('local.signup', new LocalStrategy ({ 
    usernameField:'email',
    passwordField:'password',    
    passReqToCallback: true
}, function(req, email, password,done){
     
   if (emailvalidator.validate(email)){    

        User.findOne({'email':email},function(err,user){
            if (err) {
                return done(err); //return if error
            }
            if (user) {
                return done(null,false,{message:'email is already in use'}) //return if email already exist and passes a message to flash
            }

            //If user doesnt exist and no errors then create new user in mongoDB
            let newUser = new User();
            newUser.email = email;             
            newUser.access = "customer"; 
            newUser.password = newUser.encryptPassword(password); //uses method from user.js to encrypt password
            newUser.save(function(err,result){
                if (err) {
                    return console.log(err);
                }
                return done(null, newUser);
            });
        });
    } else {
       return done(null,false,{message:'incorrect email address'})
    }
}));

//Sign In Strategy
passport.use('local.signin', new LocalStrategy ({
    usernameField:'email',
    passwordField:'password',    
    passReqToCallback: true
}, function(req,email,password,done){
    if (emailvalidator.validate(email)){   

        User.findOne({'email':email},function(err,user){
            if (err) {
                return done(err); //return if error
            }
            if (!user) {
                return done(null,false,{message:'No User Found'}) //return if email already exist and passes a message to flash
            }
            if (!user.validPassword(password)){
                return done(null,false,{message:'Inncorrect Password'}) // return if password does not match
            }
            //If user doesn exist and no errors then create new user in mongoDB
            return done(null, user);
        });

        
    } else {
        return done(null,false,{message:'incorrect email address'})
    }

}));
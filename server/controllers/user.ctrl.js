'use strict';

let User = require('../models/user');
let passport = require('passport');
let mailer = require('../libs/mailer');
let crypto = require('crypto');

module.exports = {
    user_sign_up,
    user_login,
    user_verif,
    user_reset_password_token,
    user_reset_password,
    user_update_reset_password
};

function user_sign_up (req, res, next){

  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;



  let user = {
    username: username,
    email: email,
    password: password
  };

  let token = "";

  if(!user.email || user.email == "@") {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.username){
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(user.password.length < 8 || user.password.length > 24) {
    return res.status(422).json({
      errors: {
        password: 'should be between 8 and 24 characters long',
      },
    });
  }

  User.findOne({username:username}, function(err, found_user_by_username){
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }

    if(found_user_by_username){
      return res.sendStatus(400);
    }


  User.findOne({email:email}, function(err, found_user_by_email){
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }

    if(found_user_by_email){
      return res.sendStatus(400);
    }

    var finalUser = new User(user);

  crypto.randomBytes(48, function(err, buffer) {

    token = buffer.toString('hex');

    finalUser.confirmation_token = token;

    finalUser.setPassword(user.password);

    if(!process.env.SENDGRID_API_KEY){
      finalUser.status = true;   
    }

    finalUser.save(function(err, saved_user){

      if(err){
        console.log(err);
        return res.sendStatus(500);
      }
      
      mailer.confirmation_email(saved_user.email, token, saved_user.username);
  
      return res.send(200);

    });

  });
  })
})

}

function user_reset_password_token (req, res, next){


  let email = req.body.email;

  let user = {
    email: email,
  };

  let token = "";

  if(!user.email || user.email == "@") {

    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }



  crypto.randomBytes(20, function(err, buffer) {

    token = buffer.toString('hex');

    User.findOne({ email:user.email }, function(err, user) {

      if (!user) {
        return res.status(422).json({
          errors: {
            email: 'No account with that email address exists.',
          },
        });

      }
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      user.save(function(err, saved_user){

        if(err){
          console.log(err);
          res.sendStatus(500);
        }
        console.log(saved_user);
        mailer.reset_password(saved_user.email, token, saved_user.username);
    
        return res.send(200);

      });

    });

  });

}

function user_reset_password (req, res, next){



  User.findOne({ resetPasswordToken: req.query.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
 
    if (!user) {
      return res.redirect('http://localhost:8080/resetpass');
    }
    return res.redirect('http://localhost:8080/resetform/'+req.query.token)

  });

}

function user_update_reset_password(req, res, next){

  if(!req.body.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(req.body.password.length < 8 || req.body.password.length > 24) {
    return res.status(422).json({
      errors: {
        password: 'should be between 8 and 24 characters long',
      },
    });
  }

  if(req.body.password!=req.body.repassword){
    return res.status(422).json({
      errors: {
        password: 'Passwords do not match',
      },
    });
  }

  User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.status(404).json({
        errors: {
          password: 'Token has expired or it is invalid!',
        },
      });
    }

    user.setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.save(function(err, saved_user) {
      if(err){
        console.log(err);
        res.sendStatus(500);
      }


    });
    return res.sendStatus(200);
  });

}

function user_verif(req, res, next){

  let token = req.params.token;

  User.findOne({confirmation_token: token}, function(err, found_user){

    if(err){
      console.log(err);
      res.sendStatus(500);
    }

    if(found_user){

      found_user.status = true;
      delete found_user.confirmation_token;

      found_user.save(function(err, updated_user){

        if(err){
          console.log(err);
          res.sendStatus(500);
        }

        res.redirect('http://localhost:8080/');
        return;

      });

    }else{
      console.log("User not found with confirmation token: "+ token);
      res.sendStatus(404);
      return;
    }

  });

}

function user_login(req,res,next){

    let email = req.body.email;
    let password = req.body.password;
  

  let is_admin = false;
    if(!email || email == "@") {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!password) {
      return res.status(422).json({
          errors: {
              password: 'is required',
          },
      });
    }



    return User.findOne({email:email})
            .then((user)=>{
                if(!user || !user.validatePassword(password)) {
                  return res.status(422).json({
                    errors: {
                        password_or_email: 'is invalid',
                    },
                });
                }
                if(!user.status){
                  return res.status(403).json({
                    errors: {
                        verification: 'is required',
                    },
                });
                }
                user.token = user.generateJWT();
                return res.json({ user: user.toAuthJSON()});
            }).catch((err)=>{
              console.log(err);
              return res.sendStatus(500);
            })
        
}
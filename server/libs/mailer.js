'use strict'

var nodemailer = require('nodemailer');
var ejs = require('ejs');
var email_token = './../server/templates/confirmation_token.ejs';
var reset_token = './../server/templates/reset_token.ejs';
var successful_payment = './../server/templates/successful_payment.ejs';
var error_payment = './../server/templates/error_payment.ejs';
var transporter = nodemailer.createTransport({
    service: config.mail.service,
    auth: {
           user: config.mail.user,
           pass: config.mail.password
       }
   });

module.exports = {
    confirmation_email,
    payment_error,
    payment_confirmed,
    reset_password
}

function confirmation_email(to_email, token, username){

    ejs.renderFile(email_token, {
                                    data:{
                                            confirmation_link:config.domain+"/api/user/verification/"+token
                                        },
                                    user:{
                                        username:username
                                    }
                                    }, (err, html) => {
        if (err) console.log(err); // Handle error
  
        var mailOptions = {
            from: config.mail.sender_email, // sender address
            to: to_email, // list of receivers
            subject: "CryptoFights LootBox Confirmation Token", // Subject line
            html: html// plain text body
        };
  
        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
        });
    });
    

    
}

function reset_password(to_email, token, username){

    ejs.renderFile(reset_token, {
                                    data:{
                                            confirmation_link:config.domain+"/api/user/reset/?token="+token
                                        },
                                    user:{
                                        username: username
                                    }
                                    }, (err, html) => {
        if (err) console.log(err); // Handle error
  
        var mailOptions = {
            from: config.mail.sender_email, // sender address
            to: to_email, // list of receivers
            subject: "CryptoFights LootBox Reset Password Token", // Subject line
            html: html// plain text body
        };
  
        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
        });
    });
    

    
}
function payment_error(to_email, payment_status, gateway, username){
    ejs.renderFile(error_payment, {
                                    data:{
                                            app_link:config.domain,
                                            error:payment_status,
                                            gateway:gateway
                                        },
                                    user:{
                                        username:username
                                    }
                                    }, (err, html) => {
        if (err) console.log(err); // Handle error
  
        var mailOptions = {
            from: config.mail.sender_email, // sender address
            to: to_email, // list of receivers
            subject: "CryptoFights LootBox Error on Payment", // Subject line
            html: html// plain text body
        };
  
        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
        });
    });
}

function payment_confirmed(to_email, amount, gateway, username){
    ejs.renderFile(successful_payment, {
                                    data:{
                                            app_link:config.domain,
                                            amount:amount,
                                            gateway:gateway
                                        },
                                    user:{
                                        username:username
                                    }
                                    }, (err, html) => {
        if (err) console.log(err); // Handle error
  
        var mailOptions = {
            from: config.mail.sender_email, // sender address
            to: to_email, // list of receivers
            subject: "CryptoFights LootBox Payment successful", // Subject line
            html: html// plain text body
        };
  
        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
        });
    });
}
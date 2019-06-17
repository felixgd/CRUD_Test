'use strict'

var ejs = require('ejs');
var email_token = '../server/templates/email.ejs';
var reset_token = '../server/templates/email_forgot_password.ejs';
var loan_created_template = '../server/templates/book_loan_created.ejs';
var new_costumer_template = '../server/templates/new_costumer.ejs';
var book_loan_near_date = '../server/templates/book_loan_return_date.ejs';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {
    confirmation_email,
    reset_password,
    loan_created,
    near_return_date,
    new_costumer
}

function confirmation_email(to_email, token, username){

    ejs.renderFile(email_token, {
                                    data:{
                                            confirmation_link:process.env.SERVER_DOMAIN+"/api/user/verification/"+token
                                        },
                                    user:{
                                        username:username
                                    }
                                    }, (err, html) => {
        if (err) console.log(err); // Handle error
  
        const msg = {
            to: to_email,
            from: process.env.SENDER_EMAIL,
            subject: 'Confirm your Email',
            text: html,
            html: html,
          };
          sgMail
          .send(msg)
          .then(() => {
            //Celebrate
          })
          .catch(error => {
          
            //Log friendly error
            console.error(error.toString());
          
            //Extract error msg
            const {message, code, response} = error;
          
            //Extract response msg
            const {headers, body} = response;
          });
    });
    

    
}

function loan_created(to_email, date){

    ejs.renderFile(loan_created_template, {data:{
                                        date:date
                                    }
                                }, (err, html) => {
        if (err) console.log(err); // Handle error
  
        const msg = {
            to: to_email,
            from: process.env.SENDER_EMAIL,
            subject: 'Loan Created',
            text: html,
            html: html,
          };
          sgMail
          .send(msg)
          .then(() => {
            //Celebrate
          })
          .catch(error => {
          
            //Log friendly error
            console.error(error.toString());
          
            //Extract error msg
            const {message, code, response} = error;
          
            //Extract response msg
            const {headers, body} = response;
          });
    }); 
}

function near_return_date(to_email,date){

    ejs.renderFile(book_loan_near_date, {data:{
                                        date:date
                                    }
                                },(err, html) => {
        if (err) console.log(err); // Handle error
  
        const msg = {
            to: to_email,
            from: process.env.SENDER_EMAIL,
            subject: 'Near Return Date',
            text: html,
            html: html,
          };
          sgMail
          .send(msg)
          .then(() => {
            //Celebrate
          })
          .catch(error => {
          
            //Log friendly error
            console.error(error.toString());
          
            //Extract error msg
            const {message, code, response} = error;
          
            //Extract response msg
            const {headers, body} = response;
          });
    }); 
}

function reset_password(to_email, token, username){

    ejs.renderFile(reset_token, {
                                    data:{
                                            confirmation_link:process.env.CLIENT_DOMAIN+"/change-password/"+token
                                        },
                                    user:{
                                        username: username
                                    }
                                    }, (err, html) => {
        if (err) console.log(err); // Handle error
        const msg = {
            to: to_email,
            from: process.env.SENDER_EMAIL,
            subject: 'Reset Password',
            text: html,
            html: html,
          };
          sgMail
          .send(msg)
          .then(() => {
            //Celebrate
          })
          .catch(error => {
          
            //Log friendly error
            console.error(error.toString());
          
            //Extract error msg
            const {message, code, response} = error;
          
            //Extract response msg
            const {headers, body} = response;
          });
    });
    

    
}

function new_costumer(to_email){

    ejs.renderFile(new_costumer_template, (err, html) => {
        if (err) console.log(err); // Handle error
  
        const msg = {
            to: to_email,
            from: process.env.SENDER_EMAIL,
            subject: 'Reset Password',
            text: html,
            html: html,
          };
          sgMail
          .send(msg)
          .then(() => {
            //Celebrate
          })
          .catch(error => {
          
            //Log friendly error
            console.error(error.toString());
          
            //Extract error msg
            const {message, code, response} = error;
          
            //Extract response msg
            const {headers, body} = response;
          });
    });

}
let cron = require('node-cron');
let Costumer = require('../models/user');
let mailer = require('./mailer');
cron.schedule('59 23 * * *', async () => {
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);

    Costumer.find({loans:{$size:{$gt:0}},'loans.shouldReturnAt':{$gt:start, $lt:end}},function(err, foundCustomers){
        if(err){
            console.log(err);
            return;
        }

        if(foundCustomers.length>0){
            foundCustomers.forEach((customer)=>{
                for(let i = 0;i<customer.loans.length;i++){
                    if(customer.loans[i].shouldReturnAt >= start && customer.loans[i].shouldReturnAt <= end){
                        customer.loans[i].isFined = true;
                        customer.isFlagged = true;
                        customer.save(function(err){
                            if(err){
                                console.log(err);
                            }
                        })
                    }
                }
            })
        }else{
            return;
        }
    })
});

cron.schedule('59 23 * * *', async () => {
    var start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);

    Costumer.find({loans:{$size:{$gt:0}},'loans.shouldReturnAt':{$gt:start, $lt:end}},function(err, foundCustomers){
        if(err){
            console.log(err);
            return;
        }

        if(foundCustomers.length>0){
            foundCustomers.forEach((customer)=>{
                for(let i = 0;i<customer.loans.length;i++){
                    if(customer.loans[i].shouldReturnAt >= start && customer.loans[i].shouldReturnAt <= end){
                        book_loan_near_date(customer.email, customer.loans[i].shouldReturnAt);
                    }
                }
            })
        }else{
            return;
        }
    })
});
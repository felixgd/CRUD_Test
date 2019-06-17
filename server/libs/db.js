'use strict';
var mongoose = require('mongoose'),
    singleConnection = false;

module.exports = function() {

    if(!singleConnection){
        singleConnection = mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useCreateIndex: true }, function(err, result){
           if(err) {
               console.log(err);
               console.error("Error connecting");
           }
           console.log("Connected to DB");
        });

        return singleConnection;
    }
};
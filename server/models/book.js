const mongoose = require('mongoose');
let db = require('../libs/db')();

module.exports = (() => {
    
    let Book = new mongoose.Schema({
        title: {type: String},
        barCode: {type: String, unique:true},
        qty: {type: Number},        
        publisher:{type:String},
        author:{type:String},
        categories:[{
            type:String
        }],
        createdAt: {type: Date, default: Date.now}
    }, {minimize: false});
    
    // Plugin to treat the mongo error
    Book.plugin(require('mongoose-unique-validator', {message: 'Error, expected {PATH} to be unique.'}));

    return mongoose.model('book', Book);
})();
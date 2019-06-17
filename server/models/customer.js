const mongoose = require('mongoose');
let db = require('../libs/db')();
let Book = require('./book');
const Schema = mongoose.Schema;
module.exports = (() => {
    
    let Customer = new mongoose.Schema({
        firstName: {type: String},
        secondName: {type: String},
        lastName:{type: String},
        ID:{type:String},
        email: {type: String, unique: true},
        isFlagged:{type:Boolean, default:false},
        loans:[{
            books:[{
                barCode:{type:String},
                qty:{type:Number},
                bookRef:{ type: Schema.Types.ObjectId, ref: 'book' }
            }],
            createdAt:{type:Date, default:Date.now},
            shouldReturnAt:{type:Date},
            isFined:{type:Boolean, default:false}
        }],
        createdAt: {type: Date, default: Date.now}
    }, {minimize: false});
    
    // Plugin to treat the mongo error
    Customer.plugin(require('mongoose-unique-validator', {message: 'Error, expected {PATH} to be unique.'}));

    return mongoose.model('customer', Customer);
})();
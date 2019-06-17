'use strict';

const mongoose = require('mongoose');
let db = require('../libs/db')();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = (() => {
    
    let User = new mongoose.Schema({
        username: {type: String, unique: true},
        status: {type: Boolean, default: false},
        email: {type: String, unique: true},        
        role: {type:Number, default:0},
        createdAt: {type: Date, default: Date.now},        
        confirmation_token:String,
        salt:String,
        hash:String,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    }, {minimize: false});
    
    // Plugin to treat the mongo error
    User.plugin(require('mongoose-unique-validator', {message: 'Error, expected {PATH} to be unique.'}));
        
    User.methods.setPassword = function(password) {
      
      this.salt = crypto.randomBytes(16).toString('hex');
      this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
      return
    };
    
    User.methods.validatePassword = function(password) {
      const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
      return this.hash === hash;
    };
    
    User.methods.generateJWT = function() {
      const today = new Date();
      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + 60);
    
      return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      }, 'secret');
    }
    
    User.methods.toAuthJSON = function() {
      return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
      };
    };

    return mongoose.model('user', User);
})();
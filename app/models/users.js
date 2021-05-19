// Define Modul
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator')

Schema = mongoose.Schema;
bcrypt_rounds = 5;

const user_schema = new Schema({
    username : {
        type : String,
        require : true,
        index : {
            unique : true
        }
    },
    password : {
        type : String,
        require : true
    },
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        validator : function(str) {
            return validator.isEmail(str)
        },
        message : 'Email not Valid'
    },
    date_joined : {
        type : Date,
        default : Date.now()
    }
});

user_schema.pre('save', function(next){
    const user  = this;
    if(user.isModified('password')){
        bcrypt.genSalt(bcrypt_rounds, function (err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    }else return next();
});

user_schema.methods.isPassMatch = function (pass, callback){
    bcrypt.compare(pass, this.password, function (err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    })
}

module.exports = mongoose.model('User', user_schema);
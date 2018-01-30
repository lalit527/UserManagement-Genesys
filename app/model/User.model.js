const mongoose = require('mongoose');
const Schema = mongoose.Schema();
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtKey = require('./../../config/config');

const userSchema = new Schema({
    name:   {type: String, required: true},
    email:  {
                type: email, 
                required: true,
                unique: true,
                validate:{
                    validator: validator.isEmail,
                    message: `{VALUE} is not a valid email`
                }
            },
    password: {type:String, required: true},
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    creationDate: {type: Date},
    lastUpdated: {type: Date},
    deactivateDate: {type: Date},
    status:{type:String, enum: ['active', 'inactive'], default:'active'},
    updateHistory: [{
        updateDate:{
            type: Date
        },
        updateSummary:[]
    }],
    loginHistory: [{
        login: {
            type: Date
        }
    }]
    
});

userSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
         bcrypt.genSalt(10, function(err, salt){
              bcrypt.hash(user.password, salt, function(err, hash){
                   user.password = hash;
                   next();
              });
         });
    }
});

userSchema.pre('update',function(next){
    let user = this;
    let date = new Date();
    let changes = {};
    let changesArr = [];
    user.lastUpdated = date;
    if(user.isModified('name')){
        changes = {'change1':'name changed'};
    }
    if(user.isModified('password')){
        changes = {'change2':'password updated'};
         bcrypt.genSalt(10, function(err, salt){
              bcrypt.hash(user.password, salt, function(err, hash){
                   user.password = hash;
                   next();
              });
         });
    }
    changesArr.push(changes);
    user.updateHistory.push({
        updateDate: date,
        updateSummary:changesArr
    });
    
});

userSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'x-genesys-auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, jwtKey.getjwtKey()).toString();
    let date = new Date();
    user.tokens.push({
        access: access,
        token: token
    });
    user.lastUpdated = date;

    return user.save().then((success) => {
         return token;
    });
}

userSchema.statics.findByCredential = function(email, password){
    let user = this;
    return user.findOne({email}).then(function(result){
         if(!result){
            return Promise.reject();
         }
         return new Promise((resolve, reject) => {
             bcrypt.compare(password, result.password, function(err, res){
                 if(err){
                    reject();
                 }else{
                     resolve(result);
                 }
             });
         });
    });
};

userSchema.statics.findByToken = function(token){
    let user = this;
    let decoded;
    try{
        decoded = jwt.verify(token, jwt.getjwtKey());
    }catch(e){
        return Promise.reject('Invalid Request');
    }

    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'x-genesys-auth'
    });
}

mongoose.model('User', userSchema);


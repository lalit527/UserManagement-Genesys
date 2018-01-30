const mongoose = require('mongoose');
const express = require('express');
const userModel = mongoose.model('User');
const responsegenerator = require('./../library/responsegenerator');
const authenticate = function(req, res, next){
    let token = req.header('x-genesys-token');
    if(!token){
        let myresponse = responsegenerator.generate(true, 'unauthenticated-request', 401, null);
        res.send(myresponse);
    }else{
        userModel.findByToken(token).then(function(user){
            console.log(user);
            if(!user){
              let myresponse = responsegenerator.generate(true, 'unauthenticated-request', 401, null);
              res.send(myresponse);
            }else{
                req.user = user;
                req.token = token;
                next();
            }
            
        }).catch((e) => {
            let myresponse = responsegenerator.generate(true, 'unexpected error', 500, e);
            res.send(myresponse);
        });
    }
    
}

module.exports = {
	authenticate: authenticate
}
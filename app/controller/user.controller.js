const mongoose = require('mongoose');
const express = require('express');
const userRouter = express.Router();
const userModel = mongoose.model('User');
const authenticate = require('./../../middlewares/authentication.middleware');

module.exports.controllerFunction  = function(app) {

    userRouter.post('/signup', (req, res) => {
        const date = new Date();
        if(!req.body.email || !req.body.name || !req.body.password){
           var myresponse = responsegenerator.generate(true, '', 404, null);
           res.send(myresponse);
           console.log(req.body.email);
        }else{
           var newuser = new userModel({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              creationDate: date
           });

           newuser.save((err, data) => {
               if(err){
                  var myresponse = responsegenerator.generate(true, err, 500, null);
                  res.send(myresponse);
               }else{
                  newuser.generateAuthToken().then((token) => {
                      var myresponse = responsegenerator.generate(false, 'success', 200, data);
                      res.set({'x-auth-token': token});
                      res.send(myresponse);
                  });
                  
               }
           });
        }
   });


   userRouter.post('/login', (req, res) => {
       if(!req.body.email || !req.body.password){
          var myresponse = responsegenerator.generate(true, '', 404, null);
          res.send(myresponse);
       }else{
           userModel.findByCredential(req.body.email, req.body.password).then((result) => {
               console.log(result);
               return result.generateAuthToken().then((token) => {
                  console.log(token);
                      let myresponse = responsegenerator.generate(false, 'success', 200, result);
                      //res.send(myresponse);
                      res.set({
                          'Content-Type': 'application/json',
                          'Content-Length': '123',
                          'ETag': '12345',
                          'Access-Control-Allow-Origin': '*',
                          'X-Powered-By': '',
                          'x-genesys-token': token
                      }).send(myresponse);
               });
           }).catch((err) => {
               let myresponse = responsegenerator.generate(true, err, 404, null);
               res.send(myresponse);
               console.log(err);
           });
           //res.send('hello');
       }
   });

   userRouter.post('/update', authenticate.authenticate, (req, res) => {
      if(req.body.email){
        let myresponse = responsegenerator.generate(true, 'Email cannot be updated', 404, null);
        res.send(myresponse);
      }else{
        let update = req.body;
        userModel.update({_id: req.user._id}, {update}, (err, result) => {
            if(err){
              let myresponse = responsegenerator.generate(true, err, 404, null);
              res.send(myresponse);
              console.log(err);
            }else{
              let myresponse = responsegenerator.generate(false, 'success', 200, 'Records updated');
              res.set({
                  'Content-Type': 'application/json',
                  'Content-Length': '123',
                  'ETag': '12345',
                  'Access-Control-Allow-Origin': '*',
                  'X-Powered-By': '',
                  'x-genesys-token': token
              }).send(myresponse);
            }
        });
      }
 
   });

   userRouter.post('/delete', authenticate.authenticate, (req, res) => {
    userModel.update({_id: req.user._id}, {$set: {status:'inactive'}}, (err, result) => {
        if(err){
          let myresponse = responsegenerator.generate(true, err, 404, null);
          res.send(err);
          console.log(err);
        }else{
          let myresponse = responsegenerator.generate(false, 'success', 200, 'User Deleted');
          res.set({
              'Content-Type': 'application/json',
              'Content-Length': '123',
              'ETag': '12345',
              'Access-Control-Allow-Origin': '*',
              'X-Powered-By': '',
              'x-genesys-token': token
          }).send(myresponse);
        }
    });
 });

   app.use('/user', userRouter);
}
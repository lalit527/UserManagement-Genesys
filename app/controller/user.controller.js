const mongoose = require('mongoose');
const express = require('express');
const userRouter = express.Router();
const userModel = mongoose.model('User');

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
                      var myresponse = responsegenerator.generate(false, 'success', 200, result);
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
               res.send(err);
               console.log(err);
           });
           //res.send('hello');
       }
   });

   userRouter.post('/update', (req, res) => {
    userModel.findOneAndUpdate();
   });

   app.use('/user', userRouter);
}
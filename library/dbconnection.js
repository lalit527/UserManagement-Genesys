const mongoose = require('mongoose');

const dbPath = 'mongodb://localhost/genesys';

const db = mongoose.connect(dbPath);

mongoose.connection.on('error', console.error.bind(console, 'connection error'));

mongoose.connection.once('open', function(){
    console.log("database connection open");
});
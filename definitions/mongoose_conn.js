/**
 * You don't have to require this into your other file .js anymore 
 * because mongoose connection will open once then 
 * reuse the connection automatically
 */
const mongoose = require( 'mongoose' );

/**
 * Mongoose starting connection
 */
mongoose.connect(F.config.mongodb_url, {
    autoReconnect: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    reconnectTries: Number.MAX_SAFE_INTEGER
});

// CONNECTION EVENTS
if(F.config.mongodb_debug_event) {

    // Mongoose start making connection to MongoDB
    mongoose.connection.on('connected', function () {  
        console.log(new Date().format('yyyy-MM-dd HH:mm:ss')+' : '+'Mongoose start making connection to ' + F.config.mongodb_url);
    });

    // When successfully connected
    mongoose.connection.on('connected', function () {  
        console.log(new Date().format('yyyy-MM-dd HH:mm:ss')+' : '+'Mongoose successfully connected with MongoDB');
    });

    // When connection lost mongoose will try to reconnect and the reconnect connection is successful connected
    mongoose.connection.on('reconnected', function () {  
        console.log(new Date().format('yyyy-MM-dd HH:mm:ss')+' : '+'Mongoose successfully reconnected with MongoDB');
    });

    // If the connection throws an error
    mongoose.connection.on('error',function (err) {  
        console.log(new Date().format('yyyy-MM-dd HH:mm:ss')+' : '+'Mongoose connection error: ' + err);
    });

    // Monggose start disconnecting from MongoDB
    mongoose.connection.on('disconnecting', function () {  
        console.log(new Date().format('yyyy-MM-dd HH:mm:ss')+' : '+'Disconnecting Mongoose from MongoDB'); 
    });

    // When the connection is already disconnected
    mongoose.connection.on('disconnected', function () {  
        console.log(new Date().format('yyyy-MM-dd HH:mm:ss')+' : '+'Mongoose is already disconnected from MongoDB'); 
    });

    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {
        mongoose.connection.close();
    });

}
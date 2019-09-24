const mongoose = require( 'mongoose' );

const connection = mongoose.createConnection(F.config.mongodb_url, {
    autoReconnect: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    reconnectTries: Number.MAX_SAFE_INTEGER
});

module.exports = connection;
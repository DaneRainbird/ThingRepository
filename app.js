// Imports
let express = require("express");
let bodyParser = require("body-parser"); 
let dotEnv = require("dotenv");
let { auth } = require('express-openid-connect');
let { requiresAuth } = require('express-openid-connect');
let mongoose = require("mongoose");
let Compress = require("compress.js");
let app = express();

// Configure imports
dotEnv.config();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({extended: false, limit: '20mb'})) 
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/popperjs', express.static(__dirname + '/node_modules/@popperjs/core/dist'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/js/compress.js', express.static(__dirname + '/node_modules/compress.js/index.js'));
app.use(express.static('res'));

// Setup Auth0 authentication
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SESSSECRET,
    baseURL: process.env.AUTH_BASE_URL,
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_ID,
    routes: {
        login: false
    }
};

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Setup router for endpoints
var router = require("./router.js");
app.use('/', router);

// Custom error handler
app.use((error, req, res, next) => {
    console.log("Error handler fired... " + error.message)
    res.status(error.status || 500);
    res.json({
        status: error.status,
        message: error.message
    });
    res.end();
})

// Perform MongoDB connection
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
let client = mongoose.connection;

// If there's an error with connecting to Mongo, end execution 
client.on('error', () => {
    console.log("Unable to connect to DB at " + process.env.MONGO_DB_URL + ". Exiting...");
    process.exit(1);    
});

// If successful connection, run the server
client.once('open', () => {
    console.log("Successfully connected to DB at " + process.env.MONGO_DB_URL);
    app.listen(process.env.PORT, () => console.log("Server running at port " + process.env.PORT));
});
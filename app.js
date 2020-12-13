// Imports
let express = require("express");
let bodyParser = require("body-parser"); 
let dotEnv = require("dotenv");
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
let app = express();

// Configure imports
dotEnv.config();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({extended: false, limit: '20mb'})) 
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/popperjs', express.static(__dirname + '/node_modules/@popperjs/core/dist'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.use(express.static('res'));

// Setup Auth0 authentication
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SESSSECRET,
    baseURL: 'http://localhost:8080',
    clientID: '7ENARlurk445mBHNTHxPtbH9dDk7AHSp',
    issuerBaseURL: 'https://dev-4fzaj737.au.auth0.com'
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

// Run the server 
app.listen(process.env.PORT, () => console.log("Server running at port " + process.env.PORT));
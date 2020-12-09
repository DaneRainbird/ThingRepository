var express = require('express');
const { requiresAuth } = require('express-openid-connect');
let mongoose = require('mongoose');
var router = express.Router();

// MongoDB variables and connection
let url = "mongodb://localhost:27017/data";
let Thing = require('./models/things.js');
const { exit } = require('process');
const { ObjectID, ObjectId } = require('bson');

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    if (err) {
        console.log("Could not connect to DB");
        throw err; 
    } else {
        console.log("Connected to DB at " + url);
    }
});

// Locals used in multiple pages
router.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    res.locals.activeRoute = req.originalUrl;
    res.locals.user = req.oidc.isAuthenticated() ? req.oidc.user.name : '';
    res.locals.userId = req.oidc.isAuthenticated() ? req.oidc.user.sub : '';
    next(); 
});

// Sign-in,  Sign-out, and Sign-up Routes
router.get('/login/:page', (req, res) => {
    let page = req.params.page;

    res.oidc.login({
        returnTo: page,
    });
});

router.get('/sign-up/:page', (req, res) => {
    let page = req.params.page;

    res.oidc.login({
        returnTo: page,
        authorizationParams: {
            screen_hint: "signup",
        },
    });
});

router.get('/logout/:page', (req, res) => {
    let page = req.params.page;
    
    res.oidc.logout({
        returnTo: page,
    });
});


// Regular Routes
router.get('/', (req, res) => {
    // TODO - create landing page. for now, redirect to profile page
    res.redirect("profile");
});

router.get('/profile', (req, res) => {
    user = req.oidc.isAuthenticated() ? req.oidc.user.name : '';
    userId = req.oidc.isAuthenticated() ? req.oidc.user.sub : '';
    res.render("profile.html");
});

router.get('/things', requiresAuth(), (req, res) => {
    Thing.find({user: req.oidc.user.sub}).populate('Users').exec(function(err, things) {
        if (err) throw err;
        res.render("things.html", {data: things});
    });
});

module.exports = router;
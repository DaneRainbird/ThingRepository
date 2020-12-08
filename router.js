var express = require('express');
const { requiresAuth } = require('express-openid-connect');
let mongoose = require('mongoose');
var router = express.Router();

let justSignedUp = false;

// MongoDB variables and connection
let url = "mongodb://localhost:27017/data";
let User = require('./models/users.js');
mongoose.connect(url, {useNewUrlParser: true}, function(err, client) {
    if (err) {
        console.log("Could not connect to DB");
    } else {
        console.log("Connected to DB at " + url);
    }
});

// Helper Functions
let createUserInDb = function(userEmail) {
    User.findOne({email: userEmail }, function (err, user) {
        if (err) throw err;
        if (!user) {
            let newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                email: userEmail
            })
            newUser.save(function(err) {
                if (err) throw err;
            });
        } else {
            console.log("user already exists.");
        }
    });
}

// Locals used in multiple pages
router.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    res.locals.activeRoute = req.originalUrl;
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
    justSignedUp = true;
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
    if (justSignedUp) {
        // Create a user on sign up
        createUserInDb(req.oidc.user.name);
        justSignedUp = false;
    }

    let username = req.oidc.isAuthenticated() ? req.oidc.user.name : '';
    res.render("profile.html", {user: username});
});

router.get('/rocks', requiresAuth(), (req, res) => {
    res.render("rocks.html");
});

module.exports = router;
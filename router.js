let express = require('express');
let { requiresAuth } = require('express-openid-connect');
let mongoose = require('mongoose');
let imgur = require('imgur');
let createError = require('http-errors');
var router = express.Router();

imgur.setAPIUrl('https://api.imgur.com/3/');

// MongoDB variables and connection
let url = "mongodb://localhost:27017/data";
let Thing = require('./models/things.js');

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

router.get('/login/:page?', (req, res) => {
    page = req.params == "/" ? req.params : "/profile";

    res.oidc.login({
        returnTo: page
    });
});

router.get('/sign-up/:page?', (req, res) => {
    let page = req.params;

    res.oidc.login({
        returnTo: page,
        authorizationParams: {
            screen_hint: "signup",
        },
    });
});

router.get('/logout/:page', (req, res) => {    
    res.oidc.logout({
        returnTo: '/',
    });
});

// Regular Routes
router.get('/', (req, res) => {
    res.render("landing.html");
});

router.get('/profile', requiresAuth(), (req, res) => {
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

router.post('/addThing', requiresAuth(), async (req, res, next) => {
    let imgBase64 = req.body.imageB64;
    let imgUrl = "";
    
    if (imgBase64 != undefined && imgBase64 != "" && imgBase64 != null) {
        console.log("Attempting to upload to imgur.")
        await imgur.uploadBase64(imgBase64).then(function (json) {
            imgUrl = json.data.link
            console.log("URL is " + imgUrl);
        }).catch(err => {
            next(err);
            return; // prevent continued execution
        });
    };

    let newThing = Thing({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        date: req.body.date,
        imageUrl: imgUrl,
        user: res.locals.userId
    });
    newThing.save((err) => {
        if (err) createError(400, 'An error occurred adding to the database.');
    });

    res.redirect('/things');
});

router.delete('/deleteThing', requiresAuth(), (req, res, next) => {
    Thing.deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)}).exec((err) => {
        if (err) {
            console.log(error);
            next(err);
        }
    });
    res.status(200).send();
});

module.exports = router;
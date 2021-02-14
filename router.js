let express = require('express');
let { requiresAuth } = require('express-openid-connect');
let imgur = require('imgur');
let mongoose = require('mongoose');
let xss = require('xss');
var router = express.Router();

imgur.setAPIUrl('https://api.imgur.com/3/');

// Mongoose Models
let Thing = require('./models/things.js');

// Locals used in multiple pages
router.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    res.locals.activeRoute = req.originalUrl;
    res.locals.user = req.oidc.isAuthenticated() ? req.oidc.user.name : '';
    res.locals.userId = req.oidc.isAuthenticated() ? req.oidc.user.sub : '';
    res.locals.userPicture = req.oidc.isAuthenticated() ? req.oidc.user.picture : '';
    next(); 
});

// Middleware to prevent access from Internet Explorer
router.use((req, res, next) => {
    let userAgent = req.get('user-agent');
    if (!userAgent.includes('Trident')) { // "Trident" is the IE layout engine
        next();
    } else {
        res.render('unsupported.html');
    }
});

// Auth0 Sign-In Route
router.get('/login/:page?', (req, res) => {
    let page = req.params == "/" ? req.params : "/profile";

    res.oidc.login({
        returnTo: page
    });

    user = req.oidc.isAuthenticated() ? req.oidc.user.name : '';
    userId = req.oidc.isAuthenticated() ? req.oidc.user.sub : '';
});

// Auth0 Sign-Up Route
router.get('/sign-up/:page?', (req, res) => {
    let page = req.params == "/" ? req.params : "/profile";

    res.oidc.login({
        returnTo: page,
        authorizationParams: {
            screen_hint: "signup",
        },
    });
});

// Auth0 Sign-Out Route
router.get('/logout/:page', (req, res) => {    
    res.oidc.logout({
        returnTo: '/',
    });
});

// Helper Route - returns current username and Auth0 ID
router.get('/currentUser', requiresAuth(), (req, res) => {
    res.status(200).json({
        userId: res.locals.userId,
        userName: res.locals.user,
        picture: res.locals.userPicture
    });
})

// Landing Page Route
router.get('/', (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        res.render("landing.html");
    } else {
        res.redirect("/profile")
    }
    
});

// Profile Page Route
router.get('/profile', requiresAuth(), (req, res) => {
    res.render("profile.html", {page_title: 'Profile'});
});

// User's Things Page Route 
router.get('/things', requiresAuth(), (req, res) => {
    Thing.find({user: req.oidc.user.sub}).populate('Users').exec(function(err, things) {
        if (err) next(err);
        res.render("things.html", {data: things, page_title: 'Things'});
    });
});

// Helper Route - Get JSON Data for a specific Thing
router.get("/getOneThing", requiresAuth(), (req, res) => {
    let itemId = req.query.itemId;

    Thing.findById(itemId).populate('Users').exec(function(err, thing) {
        if (err) next(err);
        if (thing.user != res.locals.userId) {
            res.status(401).send("Provided User ID does not match user ID in item.")
        } else {
            res.status(200).json(thing);
        }
    });
})

// Helper Route - Add Thing 
router.post('/addThing', requiresAuth(), async (req, res, next) => {
    let imgBase64 = req.body.imageB64;
    let imgUrl = "";
    
    // If the user has provided an image, upload it to Imgur and return the URL. 
    if (imgBase64 != undefined && imgBase64 != "" && imgBase64 != null) {
        console.log("Attempting to upload to imgur.")
        await imgur.uploadBase64(imgBase64).then(function (json) {
            imgUrl = json.data.link
            console.log("URL is " + imgUrl);
        }).catch(err => {
            next(err);
        });
    };

    let newThing = Thing({
        _id: new mongoose.Types.ObjectId(),
        name: xss(req.body.name),
        price: xss(req.body.price),
        description: xss(req.body.description),
        date: xss(req.body.date),
        imageUrl: xss(imgUrl),
        user: xss(res.locals.userId)
    });
    newThing.save((err) => {
        if (err) next(err);
        // Send all values aside from userId
        res.status(200).json({
            _id: newThing._id,
            name: newThing.name,
            price: newThing.price,
            description: newThing.description,
            date: newThing.date,
            imageUrl: newThing.imageUrl
        });
    });
});

// Helper Route - Delete Thing
router.delete('/deleteThing', requiresAuth(), (req, res, next) => {
    Thing.deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)}).exec((err) => {
        if (err) {
            next(err);
        }
    });
    res.status(200).send();
});

// Helper Route - Get JSON data for current user's statistics
router.get('/currentUserStatistics', requiresAuth(), (req, res, next) => {
    let totalPrice = 0;
    Thing.find({user: res.locals.userId}).exec((err, things) => {
        if (err) next(err);
        
        // Count total cost
        for (let i = 0; i < things.length; i++) {
            totalPrice += things[i].price;
        }

        res.status(200).json({totalPrice: totalPrice, numItems: things.length});
    });
});

// Helper Route - handles redirect for unsupported browsers
router.get('/unsupported', (req, res) => {
    res.render("unsupported.html")
});

// Catch-All / 404 Page
router.get("*", (req, res) => {
    res.status(404).render("404.html", {page_title: '404'});
})

module.exports = router;
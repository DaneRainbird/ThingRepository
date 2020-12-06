var express = require('express');
const { requiresAuth } = require('express-openid-connect');
var router = express.Router();

// Locals used in multiple pages
router.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    res.locals.activeRoute = req.originalUrl;
    next(); 
});

// Sign-in and Sign-out Routes
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
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

router.get('/profile', (req, res) => {
    res.render("profile.html");
});

router.get('/rocks', requiresAuth(), (req, res) => {
    res.render("rocks.html");
});

module.exports = router;
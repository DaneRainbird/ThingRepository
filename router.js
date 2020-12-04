var express = require('express');
var router = express.Router();

// Homepage
router.get('/', function(req, res) {
    res.render("index.html");
});

router.get('/rocks', function(req, res) {
    res.render("rocks.html")
})

module.exports = router;
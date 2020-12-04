// Imports
let express = require("express");
let bodyParser = require("body-parser"); 
let dotEnv = require("dotenv");
let app = express();

// Configure imports
dotEnv.config();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({extended: false})) 
app.use(express.static('res'));

// Setup router for endpoints
let router = require("./router.js");
app.use("/", router); 

// Run the server 
app.listen(process.env.PORT, () => console.log("Server running at port " + process.env.PORT));
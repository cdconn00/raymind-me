// dependencies
var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	mongoose       = require("mongoose"),
	flash          = require("connect-flash"),
	methodOverride = require("method-override"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	User           = require("./models/users.js"),
	List           = require("./models/lists.js"),
	Task           = require("./models/tasks.js");

// Connect to db, use and set settings
mongoose.connect("mongodb+srv://cdconn00:" + process.env.DBPASS + "@cluster0-u4cso.mongodb.net/test?retryWrites=true&w=majority", { 
	useNewUrlParser: true,
	useCreateIndex: true}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log(err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: process.env.EXPRESSSECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	// stores current user
	res.locals.currentUser = req.user;
	
	// stores flashes for error/success messages
	res.locals.error = req.flash("error");	
	res.locals.success = req.flash("success");

	next();
}); 

app.listen("3000");
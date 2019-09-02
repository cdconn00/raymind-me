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

// requiring routes
var listRoutes     = require("./routes/lists"),
	taskRoutes     = require("./routes/tasks"),	
	indexRoutes    = require("./routes/index");

// Connect to db, use and set settings
mongoose.connect(process.env.DBCONNECTSTRING, { 
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

// route configuration
app.use(indexRoutes);
app.use("/lists", listRoutes);
app.use("/lists/:id/tasks", taskRoutes);


app.listen(process.env.PORT);
var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var User = require("../models/users");
var Email = require("../email/email");

// root route
router.get("/", function(req, res){
	res.render("index");
});

// show registration form
router.get("/register", middleware.isNotLoggedIn, function(req, res){
	res.render("register");
})

// handle signup
router.post("/register", function(req, res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	});
	
	User.register(newUser, req.body.password, function(err, createdUser){
		if(err){
			req.flash("error", err.message)
			return res.redirect("/register");
		}
		else{
			passport.authenticate("local")(req, res, function(){
				Email.sendRegistrationEmail(createdUser.username, createdUser.firstName);
				req.flash("success", "Welcome to RayMind, " + createdUser.firstName + "!")
				res.redirect("/lists");
			})
		}
	});
});

// show login form
router.get("/login", middleware.isNotLoggedIn, function(req, res){
	res.render("login");
});

// attempt login
router.post("/login", passport.authenticate('local', 
	{
		successRedirect: "/lists", 
		failureRedirect: "/login",
	 	failureFlash : true
	}
	), function(req, res){
	
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully logged out.");
	res.redirect("/");
});

module.exports = router;
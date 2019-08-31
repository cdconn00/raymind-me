var middleWareObj = {};

middleWareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error", "You must be logged in to access this page");
		res.redirect("/login");
	}
}

module.exports = middleWareObj;
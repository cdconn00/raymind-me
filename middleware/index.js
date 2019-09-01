var List = require("../models/lists");
var Task = require("../models/tasks");
var middleWareObj = {};

middleWareObj.checkListOwnership = function (req, res, next){
	if(req.isAuthenticated()){
		List.findById(req.params.id).populate("tasks").exec(function(err, foundList){
			if(!err){
				if(!foundList){
					req.flash("error", "List not found.");
					res.redirect("back");
				}
				
				if(foundList.user.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "Whoops! We couldn't find that list.");
					res.redirect("back");
				}
			}
			else{
				console.log(err);
			}
		});
		
	}
	else {
		req.flash("error", "You must be logged in to access this page.");
		res.redirect("back");
	}
}

middleWareObj.checkTaskOwnership = function (req, res, next){
	if(req.isAuthenticated()){
		Task.findById(req.params.task_id, function(err, foundTask){
			if(!err){
				if(!foundTask){
					req.flash("error", "Task not found.");
					res.redirect("back");
				}
				
				if(foundTask.user.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "Whoops! You don't own that task.");
					res.redirect("back");
				}
			}
			else{
				console.log(err);
			}
		});
		
	}
	else {
		req.flash("error", "You must be logged in to access this page.");
		res.redirect("back");
	}
}

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
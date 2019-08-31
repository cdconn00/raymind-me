var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var List = require("../models/lists");


// show lists
router.get("/", middleware.isLoggedIn, function(req, res){
	List.find({"user.id" : req.user._id}, function(err, foundLists){
		if(!err){
			res.render("lists/index", {lists: foundLists});
		}
		else {
			req.flash("error", "Unable to retrieve user lists");
			res.redirect("back");
		}
	});
});

// add a new list
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.list.name;	
	var descr = req.body.list.descr;	

	var newList = 
	{ 
		name: name,
		descr: descr,
		user: {
			id: req.user._id,
			username: req.user.username
		}
	};
	
	List.create(newList, function(err, list){
		if(!err){
			req.flash("success", "Successfully added list.")
			res.redirect("lists/");	
		}
		else
			console.log(err);
	});
	
});

// show new list form
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("lists/new");
});

// show one list
router.get("/:id", middleware.checkListOwnership, function(req, res){
	var id = req.params.id;
	
	List.findById(id).populate("tasks").exec(function(err, foundList){
		if(!err){
			res.render("lists/show", {list: foundList});
		}
		else{
			req.flash("error", err.message);
			res.redirect("back");
		}
	});
});

// edit a list
router.get("/:id/edit", middleware.checkListOwnership, function(req, res){
	List.findById(req.params.id).populate("comments").exec(function(err, foundList){
		res.render("lists/edit", {list: foundList});
	});
});

// update list
router.put("/:id", middleware.checkListOwnership, function(req, res){
	List.findByIdAndUpdate(req.params.id, req.body.list, function(err, updatedList){
		res.redirect("/lists/" + req.params.id);
	});
});

//delete list
router.delete("/:id", middleware.checkListOwnership, function(req, res){
	List.findByIdAndRemove(req.params.id, function(err){
		req.flash("success", "List Successfully Deleted");
		res.redirect("/lists");
	});
});

module.exports = router;
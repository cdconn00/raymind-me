var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var List = require("../models/lists");
var Task = require("../models/tasks");

// new task form
router.get("/new", middleware.isLoggedIn, function(req, res){
	List.findById(req.params.id, function(err, foundList){
		if (!err){
			res.render("tasks/new", {list: foundList});
		}
		else{
			console.log(err);
		}
	});
	
// add new task
router.post("/", middleware.isLoggedIn, function(req, res){
	var id = req.params.id;
	
	List.findById(id, function(err, foundList){
		if(!err){
			
			Task.create(req.body.task, function(err, savedTask){
				if (!err){
					// add id to task 
					savedTask.user.id = req.user._id;
					//save task
					savedTask.save();
					foundList.tasks.push(savedTask);
					foundList.save(function(err){
						if(!err){
							req.flash("success", "Successfully added new task.")
							res.redirect("/lists/" + id);
						}
						else{
							req.flash("error", "Whoops! We couldn't create that task.");
						}
					});
				}
				else{
						console.log(err);
				}
			});
		}
		else {
			res.redirect("/lists");
		}
	});
});
	
});

// edit task 
router.get("/:task_id/edit", middleware.checkTaskOwnership, function(req, res){
	Task.findById(req.params.task_id, function(err, foundTask){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("tasks/edit", {list_id: req.params.id, task: foundTask});
		}
	});
});

// update task
router.put("/:task_id", middleware.checkTaskOwnership, function(req, res){
	Task.findByIdAndUpdate(req.params.task_id, req.body.task, function(err, updatedTask){
		if(err){
			res.redirect("back");
		}
		else {
			res.redirect("/lists/" + req.params.id);
		}
	});
});

// task destroy
router.delete("/:task_id", middleware.checkTaskOwnership, function(req, res){
	Task.findByIdAndRemove(req.params.task_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
				req.flash("success", "Successfully completed task. Awesome Job!")
			res.redirect("/lists/" + req.params.id);
		}
	});
});

module.exports = router;
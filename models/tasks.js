var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
	name: String,
	descr: String,
	dueDate: Date,
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		}
	},
	reminderDate: Date
});

module.exports = mongoose.model("Task",  taskSchema);
var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
	name: String,
	descr: String,
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		}
	},
	tasks: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }
	]
});

module.exports = mongoose.model("List",  listSchema);
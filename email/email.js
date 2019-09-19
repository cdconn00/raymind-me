'use strict';
const nodemailer = require('nodemailer');
var User = require("../models/users");
var Task = require("../models/tasks");
var mailerObj = {};

// create reusable transporter object
let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAILUSER,
		pass: process.env.EMAILPASS
	}
});

// send registration email
mailerObj.sendRegistrationEmail = function(email, userName){
	transporter.sendMail({
		from: 'Raymind.Me <info@raymind.me>', // sender address
		to: email, // reciever
		subject: 'Welcome to Raymind.Me, ' + userName +  '! ✔', // Subject line
		html: '<p><b>Welcome to Raymind.Me, ' + userName + '!</b></p><p><a href="http://raymind.me">Vist Raymind.Me</a></p>' // html body
	});
}

// find tasks with a reminder date that is today, and call for an email to be sent
mailerObj.sendDailyReminderEmails = function(){
	var date = new Date(Date.now());;
	date.setHours(0, 0, 0, 0);
	
	Task.find({reminderDate: date}, function(err, foundTasks){
		if (!err){
			foundTasks.forEach(function(task){
				User.findById(task.user.id, function(err, foundUser){
					mailerObj.sendReminderEmail(foundUser.username, foundUser.firstName, task.dueDate.toLocaleDateString(), task.name, task.descr);
				});
			});
		}
	});
	
	console.log("Daily email reminder sent.");
}

// send reminder email about a task with a reminder date that is today
mailerObj.sendReminderEmail = function(email, userName, dueDate, taskName, taskDescr){
	transporter.sendMail({
		from: 'Raymind.Me <info@raymind.me>', // sender address
		to: email, // reciever
		subject: 'Raymind-er: ' + taskName + ' is due on ' + dueDate + '!', // Subject line
		text: 'Hello world?', // plain text body
		html: "<html><head> <style> @import url(\"https://fonts.googleapis.com/css?family=Manjari&display=swap\")</style> <title></title> </head> <body style=\"text-align: center; border: 5px solid #EE82EE; width: 50%; margin: auto; margin-top: 3rem; border-radius: 2.5%; font-family: 'Manjari', sans-serif;\"> <div style=\"margin: auto auto\"> <h1>Raymind-er!</h1> <p>Howdy, " + userName +"! This is a friendly reminder of your task:</p><p><b>" + taskName + "</b> - " + taskDescr + "</p><p><b>Due on: " + dueDate + "</b></p><p><a href=\"http://raymind.me\">Vist Raymind.Me</a></p></div></body></html>" // html body
	});
}


module.exports = mailerObj;
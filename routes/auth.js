var express = require("express");
var router = express.Router();
var passport 				= require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
	res.render("landing");
});

//===============================================================
//AUTHENTIFICATION Routes

//show register form
router.get("/register", function(req, res){
	res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Gator Greats " + user.username);
			res.redirect("/players");
		});
	})	;
});
//show login form
router.get("/login", function(req, res){
	res.render("login");
});
//handle login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "players",
		failureRedirect: "/login"
	}), function(req, res){
});
//log out route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "logged you out!");
	res.redirect("/players");
});


module.exports = router;



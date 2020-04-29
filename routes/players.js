var express = require("express");
var router = express.Router();
var Player = require("../models/players");
var middleware = require("../middleware/index.js");

//player routes//////////////////////////////////////////////////////////////////
// index route show all players
router.get("/", function(req, res){
	//res.render("players", {players:players})
	// get and render player from mongoose
	Player.find({}, function(err, allplayers){
		if (err) {
			console.log(err);
		} else {
			res.render("players/index", {players: allplayers});
		}
	});
});

//create - add new player to dataade
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to camprounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newPlayer = {name: name, image: image, description: desc, author: author};
	console.log(req.user);
	//creat new player and save to database
	Player.create(newPlayer, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else {
			// redirect to players page
			res.redirect("/players");
		}
	});
});

// show form to create new player
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("players/new");
});

//SHOW - shows more info about one player
router.get("/:id", function(req, res){
	//fund player with provided id
	Player.findById(req.params.id).populate("comments").exec(function(err, foundPlayer){
		if(err || !foundPlayer){
			req.flash("error", "Player not found");
			res.redirect("back");
		} else {
			res.render("players/show", {player: foundPlayer});
		}
	});
});

//edit player route
router.get("/:id/edit", middleware.checkPlayerOwnership, function(req, res){
	Player.findById(req.params.id, function(err, foundPlayer){
		res.render("players/edit", {player: foundPlayer});		
	});
});


//update player route
router.put("/:id", middleware.checkPlayerOwnership, function(req, res){
	//find and update the corect player	
	//redirect somewhere
	Player.findByIdAndUpdate(req.params.id, req.body.player, function(err, updatedPlayer){
		if(err){
			res.redirect("/players");
		} else {
			res.redirect("/players/" + req.params.id);
		}
	});

});

//destroy campground route
router.delete("/:id/", middleware.checkPlayerOwnership, function(req, res){
	Player.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/players");
		} else {
			res.redirect("/players");
		}
	});
});




module.exports = router;

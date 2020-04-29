var Player = require("../models/players");
var Comment = require("../models/comments");
//all middleware goes here
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("/players");
			} 	else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "This is not your comment.");
					res.redirect("back");
			}
		}	
	});

	} else {
		req.flash("error", "Please log in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkPlayerOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		//does user own the campground?
		Player.findById(req.params.id, function(err, foundPlayer){
			if(err || !foundPlayer){
				req.flash("error", "Player not found");
				res.redirect("/players");
			} 	else {
						//does user own the campground?
				if(foundPlayer.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "This is not your player to edit");
					res.redirect("back");
			}
		}	
	});

	} else {
		req.flash("error", "Please log in to do that");
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please log in to do that");
	res.redirect("/login");
};



module.exports = middlewareObj;
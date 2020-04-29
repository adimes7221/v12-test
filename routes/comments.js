var express = require("express");
var router = express.Router({mergeParams: true});
var Player = require("../models/players");
var Comment = require("../models/comments");
var middleware = require("../middleware");

////////////////////////////////////////////////////////////////////
//COMMENTS ROUTES
///////////////////////////////////////////////////////////////////////
router.get("/new", middleware.isLoggedIn, function(req,res){
	//find player by id
	Player.findById(req.params.id, function(err, player){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {player: player});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup player using id
	Player.findById(req.params.id, function(err, player){
		if(err){
			console.log(err);
			res.redirect("/players");
		} else {
		//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					player.comments.push(comment);
					player.save();
					req.flash("success", "Added comment");
					res.redirect('/players/' + player._id);
				}
			});
		}
	});
});
//////////////////////////////////////////////////////
//EDIT COMMENTS ROUTES
////////////////////////////////////////////////////
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Player.findById(req.params.id, function(err, foundPlayer){
		if(err || !foundPlayer){
			req.flash("error", "Player not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");		
			} else {
				res.render("comments/edit", {player_id: req.params.id, comment: foundComment});
			}
		});	
	});	
});

/////////////////////////////////////////////////////////
//UPDATE COMMENTS ROUTES
///////////////////////////////////////////////////////////
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/players/" + req.params.id);
		}
	});
});
//////////////////////////////////////////////////////////////
//DESTROY COMMENTS ROUTES
//////////////////////////////////////////////////////////////
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//find by id and remove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/players/" + req.params.id);
			}
	});
});

module.exports = router;
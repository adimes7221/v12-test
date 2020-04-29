var express 				= require("express");
var	app 					= express();
var bodyParser 				= require("body-parser");
var mongoose 				= require("mongoose");
var passport 				= require("passport");
var LocalStrategy			= require("passport-local");
var passportLocalMongoose	= require("passport-local-mongoose");
var methodOverride			= require("method-override");
var flash 					= require("connect-flash");

var Player 					= require("./models/players");
var	Comment   				= require("./models/comments");
var	seedDB 					= require("./seeds");
var User 					= require("./models/user");
//requiring routes
var commentRoutes	= require("./routes/comments"),
	playersRoutes 	= require("./routes/players"),
	authRoutes		= require("./routes/auth");

mongoose.connect("mongodb://localhost:27017/gator_greats", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed database
//seedDB();

//=================================================================
//PASSPORT configuration
app.use(require("express-session")({
	secret: "Rex Grossman deserved a heisman...",
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



//express router
app.use("/", authRoutes);
app.use("/players/:id/comments", commentRoutes);
app.use("/players", playersRoutes);


//port listeningls

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    cookieParser = require('cookie-parser'),
    localStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    //passportLocalMongoose = require("passport-local-mongoose"),
    session = require('express-session');

var User = require("./models/user");
//database connection
mongoose.connect("mongodb://localhost/NagpurStartups1");
var db = mongoose.connection;
//config
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//local strategy
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
     	if(isMatch){
     	  return done(null, user);
     	} else {
     	  return done(null, false, {message: 'Invalid password'});
     	}
     });
   });
  }
));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

// app.use(require("express-session")({
//     secret: "123",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use(function(req,res,next){
//     res.locals.currentUser = req.user;
//     next();
// });

//Login & signup routes
app.get("/signup",function(req,res){
    res.render("signup");
});
/*app.post("/signup",function(req,res){
    console.log(req.body)
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(!err){
            passport.authenticate("local")(req,res,function(){
                //console.log(user);
                res.redirect("/login");
            });
        } else{
            console.log(err);
            res.render("signup");
        }
    });
}); */

// Register User
app.post('/signup', function(req, res){
    var password = req.body.password;
    var password2 = req.body.password1;
    var birthday = req.body.birthday;
    //console.log(req.body);
    birthday = birthday.replace("/","-")
    if (password == password2){
      var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.username,
        username: req.body.username,
        password: req.body.password,
        birthday: req.body.birthday,
        gender: req.body.gender,
        phone: req.body.phone,
        category: req.body.category
      });
  
      User.createUser(newUser, function(err, user){
        if(err) throw err;
        res.send(user).end()
      });
    } else{
      res.status(500).send("{errors: \"Passwords don't match or something else went wrong\"}").end()
    }
});

app.get("/login",function(req,res){
    res.render("login");
});

// app.post("/login",passport.authenticate("local",{
//     successRedirect: "/",
//     failureRedirect: "/login"
// }),function(req,res){
//     console.log(req.user.username);
// });

// Endpoint to login
app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.send(req.user);
  }
);

// Endpoint to logout
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});

//Login Checker middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
};

//routes
app.get("/",function(req,res){
    res.render("home");
});

// Endpoint to get current user
app.get('/user', isLoggedIn, function(req, res){
  res.send(req.user);
});

app.get('startups', isL)

app.listen(3000,() => {
    console.log("started");
});
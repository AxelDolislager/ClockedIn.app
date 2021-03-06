// Requirements
const   express         = require("express"),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        mongoose        = require("mongoose"),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        config          = require("./config/config.js")
var     app             = express()

// Mongoose
mongoose.connect(config.db.MONGODB_URI)

// Models
var User    = require("./models/user"),
    Project = require("./models/project")

// Routes
var indexRoutes     = require("./routes/index"),
    userRoutes      = require("./routes/users"),
    projectRoutes   = require("./routes/projects"),
    taskRoutes      = require("./routes/tasks")

// Express Settings
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(methodOverride("_method"))

// Passport Configuration
app.use(require("express-session")({
    secret: config.app.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
//   res.locals.success = req.flash('success');
//   res.locals.error = req.flash('error');
   next();
});


//Router
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/projects", projectRoutes),
app.use("/projects/:id/tasks", taskRoutes)

//404
app.get("*", function(req, res){
    res.redirect("404");
});

//Start App
app.listen(config.app.PORT, config.app.IP, function(){
   console.log("The ProjectManagerApp Server Has Started!");
});
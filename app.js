const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const moment = require("moment");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");

const User = require("./models/user");

const stallRoutes = require("./routes/stalls");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/GoodFruit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.set("view engine", "ejs");
const staticDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(staticDirectoryPath));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.moment = moment;
// passport configuration

app.use(
  require("express-session")({
    secret: "Useless string",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*====================middleware==============================*/

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/*===============================================================*/

app.use("/", indexRoutes);
app.use("/stalls", stallRoutes);
app.use("/stalls/:id/comments", commentRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

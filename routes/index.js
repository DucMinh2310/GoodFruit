const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Hello, " + user.username);
                res.redirect("/stalls");
            });
        }
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/stalls",
        failureRedirect: "/login"
    }),
    (req, res) => {}
);

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/stalls");
});

module.exports = router;
const express = require("express");
const Stall = require("../models/stall");
const Comment = require("../models/comment");
const router = express.Router({ mergeParams: true });

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// show form add cmt
router.get("/new", isLoggedIn, (req, res) => {
  const id = req.params.id;
  Stall.findById(id, (err, stall) => {
    if (err) console.log(err);
    else {
      res.render("comments/new", {
        fruitStall: stall
      });
    }
  });
});

// cmt create
router.post("/", (req, res) => {
  Stall.findById(req.params.id, (err, stall) => {
    if (err) console.log(err);
    else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          stall.comments.push(comment);
          stall.save();
          res.redirect(`/stalls/${stall._id}`);
        }
      });
    }
  });
});

module.exports = router;

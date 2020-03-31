const express = require("express");
const Stall = require("../models/stall");
const Comment = require("../models/comment");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware/index");

// show form add cmt
router.get("/new", middleware.isLoggedIn, (req, res) => {
    const id = req.params.id;
    Stall.findById(id, (err, stall) => {
        if (err) {
            req.flash("error", err);
        } else {
            res.render("comments/new", {
                fruitStall: stall
            });
        }
    });
});

// cmt create
router.post("/", (req, res) => {
    Stall.findById(req.params.id, (err, stall) => {
        if (err) {
            req.flash("error", err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", err);
                } else {
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

router.get("/:comment_id/edit", (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else
            res.render("comments/edit", {
                stall_id: req.params.id,
                comment: foundComment
            });
    });
});

router.put("/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        (err, updatedComment) => {
            if (err) {
                req.flash("error", err);
            } else {
                res.redirect("/stalls/" + req.params.id);
            }
        }
    );
});

router.delete("/:comment_id", (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, err => {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            req.flash("success", "Deleted Successfully");
            res.redirect("/stalls/" + req.params.id);
        }
    });
});
module.exports = router;
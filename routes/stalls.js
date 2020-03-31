const express = require("express");
const Stall = require("../models/stall");
const router = express.Router();
const middleware = require("../middleware/index");

router.get("/", (req, res) => {
    // get all recipe from db
    Stall.find({}, (err, allStall) => {
        if (err) {
            req.flash("error", err);
        } else {
            res.render("stalls/index", {
                allFruitStall: allStall
            });
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("stalls/new");
});

router.post("/", (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newStall = { name, image, price, description, author };

    Stall.create(newStall, (err, newlyStall) => {
        if (err) {
            req.flash("error", err);
        } else {
            res.redirect("/stalls");
        }
    });
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    Stall.findById(id)
        .populate("comments")
        .exec((err, foundStall) => {
            if (err) {
                req.flash("error", err);
            } else {
                res.render("stalls/show", {
                    fruitStall: foundStall
                });
            }
        });
});

router.get("/:id/edit", checkStallOwnership, (req, res) => {
    Stall.findById(req.params.id, (err, foundStall) => {
        res.render("stalls/edit", {
            stall: foundStall
        });
    });
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    Stall.findByIdAndUpdate(id, req.body.stall, (err, updatedStall) => {
        if (err) {
            req.flash("error", err);
            res.redirect("/stalls");
        } else {
            res.redirect("/stalls/" + updatedStall._id);
        }
    });
});

router.delete("/:id", (req, res) => {
    Stall.findByIdAndRemove(req.params.id, err => {
        if (err) {
            req.flash("error", err);
            res.redirect("/stalls");
        } else {
            res.redirect("/stalls");
        }
    });
});

function checkStallOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Stall.findById(req.params.id, (err, foundStall) => {
            if (err) {
                req.flash("error", err);
                res.redirect("back");
            } else {
                if (foundStall.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;
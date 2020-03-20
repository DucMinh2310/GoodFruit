const express = require("express");
const Stall = require("../models/stall");
const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", (req, res) => {
  // get all recipe from db
  Stall.find({}, (err, allStall) => {
    if (err) console.log(err);
    else {
      res.render("stalls/index", {
        allFruitStall: allStall
      });
    }
  });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("stalls/new");
});

router.post("/", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newStall = { name, image, description, author };

  Stall.create(newStall, (err, newlyStall) => {
    if (err) console.log(err);
    else {
      res.redirect("/stalls");
    }
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Stall.findById(id)
    .populate("comments")
    .exec((err, foundStall) => {
      if (err) console.log(err);
      else {
        res.render("stalls/show", {
          fruitStall: foundStall
        });
      }
    });
});

router.get("/:id/edit", (req, res) => {
  Stall.findById(req.params.id, (err, foundStall) => {
    if (err) console.log(err);
    else {
      if (foundStall.author.id.equals(req.user._id)) {
      }
      res.render("stalls/edit", {
        stall: foundStall
      });
    }
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  Stall.findByIdAndUpdate(id, req.body.stall, (err, updatedStall) => {
    if (err) {
      console.log(err);
      res.redirect("/stalls");
    } else {
      res.redirect("/stalls/" + updatedStall._id);
    }
  });
});

router.delete("/:id", (req, res) => {
  Stall.findByIdAndRemove(req.params.id, err => {
    if (err) {
      console.log(err);
      res.redirect("/stalls");
    } else {
      res.redirect("/stalls");
    }
  });
});

module.exports = router;

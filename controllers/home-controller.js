const User = require("../models/user");

exports.index = function (req, res) {
  res.render("index", {
    title: "Home",
    layout: "./layouts/main-layout",
    user: req.session.user || null,
  });
};

exports.profile = function (req, res) {
  res.render("profile", {
    title: "Profile",
    layout: "./layouts/main-layout",
    user: req.session.user || null,
  });
};
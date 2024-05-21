const User = require("../models/user");

exports.index = function (req, res) {
  res.render("index", {
    title: "Home",
    layout: "./layouts/main-layout",
    user: req.session.user || null,
  });
};

exports.profile = async function (req, res) {
  const user = await User.findOne({
    login: req.session.user.name,
  });

  console.log(user.login);
  console.log(user.rP);
  res.render("profile", {
    title: "Profile",
    layout: "./layouts/main-layout",
    user: user || null,
  });
};
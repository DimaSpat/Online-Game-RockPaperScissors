exports.gamePage = function (req, res) {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  res.render("game", {
    title: "Game",
    layout: "./layouts/main-layout",
    user: req.session.user || null,
  });
};

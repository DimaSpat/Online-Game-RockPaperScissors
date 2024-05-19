const User = require("../models/user");

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

exports.updatingUser = async function (req, res) {
  const gameResults = require("../public/javascripts/script");

  if (gameResults.gameEnd) {
    const user = await User.findOne({ login: req.session.user }).exec();
    const rp = user.rP;
    const rw = user.rW;
    const rl = user.rL;

    const update = {
      rP: rp++,
    };

    if (gameResults.isWinner) {
      Object.assign(update, {rW: rw++});
    } else {
      Object.assign(update, { rL: rl++ });
    }

    Object.assign(update, {WPL: rW / rL});

    await User.updateOne(user, update);

    user.rP = update.rP;
    user.rW = update.rW;
    user.rL = update.rL;
    user.WPL = update.WPL;
    user.save();
    user.done();
  }
};

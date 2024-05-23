const User = require("../models/user");

exports.registerPage = function (req, res) {
  res.render("register", {
    title: "Registration",
    layout: "./layouts/main-layout",
    user: req.session.user || null,
  });
};

exports.addUser = async function (req, res) {
  const user = new User({
    login: req.body.login,
    password: req.body.password,
    rP: 0,
    rW: 0,
    rL: 0,
    WPL: 0,
  });

  try {
    const findUser = await User.findOne({ login: user.login });

    if (!findUser) {
      await user.save();
      res.redirect("/");
    } else {
      res.render("register", {
        errMess: "User with this login already exists",
        errSelector: "login",
        title: "Register",
        password: req.body.password,
        login: req.body.login,
        layout: "./layouts/main-layout",
      });
    }
  } catch (err) {
    if (err.errors.password) {
      res.render("register", {
        errSelector: "password",
        title: "Register",
        password: req.body.password,
        login: req.body.login,
        layout: "./layouts/main-layout",
      });
    } else if (err.errors.login) {
      res.render("register", {
        errSelector: "login",
        title: "Register",
        password: req.body.password,
        login: req.body.login,
        layout: "./layouts/main-layout",
      });
    }
  }
};

exports.authorizationPage = function (req, res) {
  res.render("authorization", {
    title: "Login",
    user: req.session.user || null,
  });
};

exports.login = async function (req, res) {
  const user = await User.findOne(
    {
      login: req.body.login,
      password: req.body.password,
    }
  ).exec();


  if (user) {
    req.session.user = { id: user._id, name: user.login, rP: user.rP, rW: user.rW, rL: user.rL, WPL: user.WPL };
    res.redirect("/");
  } else {
    res.render("authorization", {
      errMessage: "Incorrect password or username",
      title: "Log in",
      user: req.session.user || null,
    });
  }
};

exports.logout = function (req, res) {
  delete req.session.user;
  res.redirect("/");
};

exports.resetPassword = async function (req, res) {
  const update = {
    password: req.body.password,
  };
  const user = await User.findOne({
    login: req.session.user.name,
  });

  await User.updateOne(user, update.password);

  user.password = update.password;
  user.save();
};

exports.updateUserStats = async function (socket, login, gameEnd, isWinner) {
  const user = await User.findOne({
    login: login,
  });

  if (gameEnd) {
    const update = {
      rP: user.rP + 1,
      rW: user.rW + (isWinner? 1 : 0),
      rL: user.rL + (isWinner? 0 : 1),
    };

    function getWPL(rW, rL) {
      if (rW === 0) {
        return 0;
      } else if (rL === 0 && rW !== 0) {
        return rW;
      } else if (rL!== 0 && rW !== 0) {
        return (rW / rL);
      }
    }

    Object.assign(update, {WPL: getWPL(update.rW, update.rL)});

    const newSession = {
      id: socket.request.session.user.id,
      name: socket.request.session.user.name,
      rP: update.rP,
      rW: update.rW,
      rL: update.rL,
      WPL: update.WPL,
    };

    req = newSession;
    await User.updateOne(user, update);

    user.rP = update.rP;
    user.rW = update.rW;
    user.rL = update.rL;

    user.save();
  }
}

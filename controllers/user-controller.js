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
  });

  try {
    const findUser = await User.findOne({ login: user.login });

    if (!findUser) {
      await user.save();
      user.done();
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
      -res.render("register", {
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

  console.log(`user ${user.login} with password ${user.password}`);

  if (user) {
    req.session.user = { id: user._id, name: user.login };
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
  user.done();
};

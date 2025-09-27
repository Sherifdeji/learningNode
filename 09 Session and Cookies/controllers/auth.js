const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly"); // the HttpOnly flag makes the cookie inaccessible to JavaScript's Document. It helps mitigate the risk of client side script accessing the protected cookie data. It's an additional layer of security.
  User.findById("68d1f28ac2745d9811ad573b")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      }); // to make sure that the session is saved before we redirect, we dont normally to use the .save() method, but in this case we want to be sure that the session is saved before we redirect
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

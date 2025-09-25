exports.getLogin = (req, res, next) => {
  isLoggedIn = req.get("Cookie").split(";")[0].trim().split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly"); // the HttpOnly flag makes the cookie inaccessible to JavaScript's Document. It helps mitigate the risk of client side script accessing the protected cookie data. It's an additional layer of security.
  req.session.isLoggedIn = true;
  res.redirect("/");
};

require("dotenv").config();

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf(); // for any non-get request we need to add a valid csrf token to the request body, otherwise the request will be rejected. because we usually change data on non-get requests, so this is a good security measure to prevent cross-site request forgery attacks.

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash()); // must be used after the session middleware, because it uses the session to store the flash messages

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user?._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
}); // the res.locals object is available in all views that are rendered, so we can use it to pass data to all views without having to pass it manually in each controller

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// setup mongoose connection
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("Connected to MongoDB");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

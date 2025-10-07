require("dotenv").config();

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer"); // we are using multer in order to handle file uploads cos body-parser cannot handle file uploads it can only handle text data

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
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
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
      // throw new Error(err);
      // No, they're not the same.
      // `next(new Error(err))` and `throw new Error(err)` handle errors differently in Express:
      // - `next(new Error(err))` passes the error to Express's error handling middleware, allowing your app to continue processing the request and handle the error gracefully.
      // - `throw new Error(err)` immediately terminates the current function execution and jumps to the nearest catch block or crashes the application if uncaught.
      // In Express applications, using `next(new Error())` is the preferred approach for error handling because it maintains the request/response cycle and allows custom error handlers to process the error.
      // in async code (like in a promise), throwing an error will not be caught by Express's error handling middleware, so we use next(new Error(err)) instead so that it can be caught by the error handling middleware. but in sync code it will be caught by express error handling middleware if thrown
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
}); // the res.locals object is available in all views that are rendered, so we can use it to pass data to all views without having to pass it manually in each controller

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

// express error handling middleware, express recognizes it by the fact that it has 4 arguments, it must be defined after all other app.use() and routes calls and it will be called whenever next(error) is called in any middleware or route handler
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpStatusCode || 500);
  res.render("500", {
    pageTitle: "Error",
    path: "/500",
  });
});

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

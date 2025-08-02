const express = require("express");
const path = require("path"); // path is a built-in module in node that helps us to work with file paths, it provides utilities for working with file and directory paths, it is used to create and manipulate file paths in a cross-platform way, so we can use it to create paths that work on both windows and linux/mac

const adminData = require("../routes/admin");
const shopRoutes = require("../routes/shop");

const bodyParser = require("body-parser"); // body-parser is a middleware that parses the incoming request body and makes it available in req.body, it is used to parse the url encoded data from the request body, it is not built-in so we have to install it using npm i body-parser, but express has a built-in middleware that does the same thing so we can use that instead

const app = express();

app.set("view engine", "ejs"); // this sets the view engine to ejs, so we can use ejs to render our views, this is a template engine that allows us to create dynamic html pages
app.set("views", "views"); // this sets the views directory to the views folder, so express will look for views in the views folder, this is where we will put our ejs files, we can also use path.join(__dirname, "views") to set the views directory to the views folder, but since we are using ejs we can just use "views" as the second argument

// middlewares are like funnels(that have functions(request handlers) hooked into it) that incoming requests pass through

// // format for using the middleware(.use())
// app.use((req, res, next) => {
//   console.log("In the middleware");
//   next(); // allows the request to continue to the next middleware in line, if we dont call next, we cant move on the next middleware
// });

// app.use((req, res, next) => {
//   console.log("In another middleware");
//   res.send("<h1>Hello from express!</h1>"); // this is the way of sending res in express, u dont need to setheaders and all those stuffs it will be automatically done for you though u can always overwrite that
// });

// // const server = http.createServer(app); // app is a valid req. handler and can be passed into the createserver
// // server.listen(3000);

// // in express we can combine the task of creating a server and listening at a port in a single line by just doing:
// app.listen(3000) // this makes it not necessary to import http module anymore

//// Handling Routes \\\\\\\\\

// app.use("/add-product", (req, res, next) => {
//   // u know it goes from top to bottom that's why we put this above the handler for '/' so this can get evaluated first and when we do res.send we wont bother about any other handler
//   console.log("In a middleware");
//   res.send("<h1>The 'add product' page</h1>");
// });

// app.use("/", (req, res, next) => {
//   // note that if this comes first all other middleware wont get executed(cos we res.send) cos the '/' condition is not one that checks strictly it just checks that if it starts with / and thus will always run. We can use .get() and others instead to help with strict checking
//   console.log("In a middleware");
//   res.send("<h1>Hello from express!</h1>");
// });

// app.listen(3000);

// //////// Parsing Incoming Requests
// app.use(bodyParser.urlencoded({ extended: false })); // this should come ontop as we want to always parse the url body before the route handlers

// app.use("/admin/", adminRoutes);
// app.use(shopRoutes);

// app.use((req, res, next) => {
//   // this like a catch all route, since the url doesn't make any of the previous ones, it just throws an error, remember that we dont need to specify any path since the default is / and it will run for any path anyways
//   res.status(404).send("<h1>Page not found😢</h1>");
// });

// app.listen(3000);

// // NB: app.use() always gets executed for all types of http requests (i.e it handles all http methods) wheter its a get or post it will still get executed but we can limit this(a way of filtering our requests) by using app.get() and others(delete, put, patch). they have same syntax as app.use()

///////////// Serving HTML Pages \\\\\\\\\\\\\\\
app.use(bodyParser.urlencoded({ extended: false })); // this is a middleware that parses the incoming request body and makes it available in req.body, it is used to parse the url encoded data from the request body, this should come before the route handlers so that we can access the parsed data in the route handlers
app.use(express.static(path.join(__dirname, "..", "public"))); // this will serve static files(as the requests do not normally have access to our file system, so this a feature provided by node so the req can have access to our file system) like css, js, images, etc. from the public folder; we can also use express.static() to serve static files from a specific folder, this is useful for serving files like css, js, images, etc. that are not dynamic and dont need to be processed by the server

app.use("/admin/", adminData.routes); // we can use the same path as the one in the router file, this is because express will only pass requests that start with /admin to the adminRoutes, so we dont have to worry about conflicts; this is like a filter, so only requests that start with /admin will be passed to the adminRoutes, so we can use the same path as the one in the router file
app.use(shopRoutes); //

app.use((req, res, next) => {
  // the difference between this and the one above is that this one will only run if the url doesn't match any of the previous ones, so it acts like a catch all route
  // res.status(404).send("<h1>Page not found😢</h1>");
  res.sendFile(path.join(__dirname, "..", "views", "404.html")); // instead of using ../ we can just do .. so as to make it more flexible for whatever os its running in
});

app.listen(3000);

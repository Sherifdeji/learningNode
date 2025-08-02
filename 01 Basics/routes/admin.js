const express = require("express");
const path = require("path");

const rootDir = require("../util/path"); // we import the path module that we created to get the absolute path to the root directory of our project, this is useful for building paths to other files in our project

const router = express.Router(); // we use express.Router() to create a new router object that we can use to define our routes, this is like a mini express app that we can use to handle routes separately from the main app
// this is useful for organizing our routes and keeping our code clean, we can then export this router object and use it in our main app file

const products = []; // this is an array that we will use to store the products that we add, this is just for demonstration purposes, in a real app we would use a database to store the products

// Also note that same paths(urls) can be used if we are using different http methods

//NB: if we have a setup where our paths in our router file start with the same segment, we can take that segment out of the urls then take it to the app.js file(i.e the main file where we pass the request) and add the segment as a filter in app.use(); thus only routes starting with that segment(in our case here, /admin) will go into the router file

// we get here from /admin/add-product => but with GET
// router.get("/add-product", (req, res, next) => {
//   res.send(
//   // note that we dont have to add the /admin path here cos express will now omit that path that we filtered in the app.use() here, so it kind of implicit. Though when your are browsint u'll need to put the /admin path to get here. It just that its not needed for us to put the /admin path here again since its only paths that has /admin that will get here in the first place.
//     "<form action='/admin/add-product' method='POST'><input type='text' name='title'><button type='submit'>Add Product</button></form>"
//   );
// });

// // we get here from /admin/add-product => but with POST
// router.post("/add-product", (req, res, next) => {
//   console.log(req.body);
//   res.redirect("/");
// });

// module.exports = router;

//// Serving html page \\\\\\\\\\
router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(rootDir, "..", "views", "add-product.html")); // we use path.join to build the path to the file, this is a good practice as it will work on both linux and windows systems
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  }); // we use res.render() to render the ejs file, this is a method provided by express that allows us to render ejs files, we can also pass data to the ejs file using the second argument using the second argument, this is useful for passing dynamic data to the ejs file, like the title of the page, the path of the page, etc.
});

router.post("/add-product", (req, res, next) => {
  // console.log(req.body);
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router; // we export the router object so that we can use it in our main app file
exports.products = products; // we export the products array so that we can use it in our main app file
